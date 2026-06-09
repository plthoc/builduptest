"use client";

import { motion, useReducedMotion, type Variants, type HTMLMotionProps } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease } },
};

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/**
 * Reveal — gentle scroll-triggered fade + lift. Matches MVN Studio's restrained motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  once = true,
  amount = 0.25,
  ...rest
}: HTMLMotionProps<"div"> & { delay?: number; y?: number; once?: boolean; amount?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.8, ease, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function RevealStagger({
  children,
  className,
  once = true,
  amount = 0.2,
  ...rest
}: HTMLMotionProps<"div"> & { once?: boolean; amount?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={reduce ? undefined : staggerParent}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className, ...rest }: HTMLMotionProps<"div">) {
  return (
    <motion.div className={className} variants={fadeUp} {...rest}>
      {children}
    </motion.div>
  );
}
