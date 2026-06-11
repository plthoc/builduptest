"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Reveal } from "@/components/ui/motion-primitives";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(20, "Tell us a bit more (at least 20 characters)"),
  topic: z.enum(["New Concepts", "Studio Support", "Game Sales", "Other"]),
});

type FormValues = z.infer<typeof schema>;

export function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { topic: "Studio Support" },
  });

  const onSubmit = async (values: FormValues) => {
    setStatus("loading");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("success");
      reset({ topic: "Studio Support", name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <section
      id="contact"
      className="surface-white relative section-pad"
    >
      <div className="container-x">
        {/* Two-column layout — MVN style */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Left — copy */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="eyebrow text-ink-500">{siteConfig.contact.eyebrow}</div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-3 font-display text-display-md font-medium tracking-tight text-ink-900 text-balance">
                Let&apos;s build your <span className="serif-italic">next</span> Roblox hit.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-lg text-ink-500 text-pretty">
                {siteConfig.contact.body}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="mt-8 inline-flex items-center gap-2 text-base font-medium text-ink-900 transition-colors hover:text-accent focus-ring"
              >
                <Mail className="h-4 w-4" />
                {siteConfig.contact.email}
              </a>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-12 space-y-6">
                {siteConfig.contact.options.map((opt) => (
                  <div key={opt.title} className="border-t border-line pt-5">
                    <div className="eyebrow text-ink-500">{opt.tag}</div>
                    <div className="mt-2 font-display text-lg font-medium text-ink-900">
                      {opt.title}
                    </div>
                    <p className="mt-1 text-sm text-ink-500 text-pretty">
                      {opt.body}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — form card */}
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-4xl border border-line bg-white p-8 shadow-soft md:p-10"
              >
                <AnimatePresence mode="wait">
                  {status === "success" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center justify-center py-16 text-center"
                    >
                      <div className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-accent/10 text-accent">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <h3 className="font-display text-2xl font-medium text-ink-900">
                        Message sent.
                      </h3>
                      <p className="mt-2 max-w-sm text-ink-500">
                        We&apos;ll get back to you within 48 hours at the email you provided.
                      </p>
                      <button
                        type="button"
                        onClick={() => setStatus("idle")}
                        className="mt-8 text-sm font-medium text-ink-500 underline-offset-4 hover:text-ink-900 hover:underline focus-ring"
                      >
                        Send another
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <Field label="Name" error={errors.name?.message}>
                          <input
                            type="text"
                            placeholder="Your name"
                            autoComplete="name"
                            {...register("name")}
                            className={inputClass}
                          />
                        </Field>
                        <Field label="Email" error={errors.email?.message}>
                          <input
                            type="email"
                            placeholder="you@studio.com"
                            autoComplete="email"
                            {...register("email")}
                            className={inputClass}
                          />
                        </Field>
                      </div>

                      <Field label="Topic" error={errors.topic?.message}>
                        <select
                          {...register("topic")}
                          className={`${inputClass} cursor-pointer appearance-none pr-10`}
                        >
                          <option>New Concepts</option>
                          <option>Studio Support</option>
                          <option>Game Sales</option>
                          <option>Other</option>
                        </select>
                      </Field>

                      <Field
                        label="Tell us about your game, concept, or opportunity"
                        error={errors.message?.message}
                      >
                        <textarea
                          rows={5}
                          placeholder="A few sentences about your project, the team, and what you're looking for."
                          {...register("message")}
                          className={`${inputClass} resize-y min-h-[140px]`}
                        />
                      </Field>

                      {errorMsg && (
                        <p className="text-sm text-red-600">{errorMsg}</p>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        <p className="text-xs text-ink-500">
                          We&apos;ll only use your email to reply. No spam, ever.
                        </p>
                        <button
                          type="submit"
                          disabled={status === "loading"}
                          className="btn-pill btn-dark focus-ring"
                        >
                          {status === "loading" ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Sending…
                            </>
                          ) : (
                            <>
                              Send message
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-2xl border border-line bg-surface-50 px-4 py-3 text-[15px] text-ink-900 placeholder:text-ink-300 outline-none transition-colors focus:border-ink-900 focus:bg-white";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block text-ink-500">{label}</span>
      {children}
      {error && (
        <span className="mt-1.5 block text-xs text-red-600">{error}</span>
      )}
    </label>
  );
}
