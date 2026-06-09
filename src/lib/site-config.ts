// Site configuration — edit here to update content site-wide
export const siteConfig = {
  name: "BuildUp Games",
  shortName: "BuildUp",
  tagline: "Building games worth playing.",
  description:
    "BuildUp develops, scales, and acquires Roblox experiences with a focus on games that keep players coming back.",
  hero: {
    eyebrow: "Roblox Publishing Studio",
    titleLines: ["Building Games", "Worth Playing"],
    subtitle: "Where Roblox ideas come alive — through creative direction, live operations, and a publishing ecosystem built to grow.",
    primaryCta: { label: "Explore experiences", href: "#experiences" },
    secondaryCta: { label: "Get in touch", href: "#contact" },
    stats: [
      { value: "0", label: "Total CCU" },
      { value: "0", label: "Total Visits" },
    ],
  },
  about: {
    eyebrow: "About BuildUp",
    title: "Games that keep players coming back.",
    body: "BuildUp develops, scales, and acquires Roblox experiences with a focus on games that keep players coming back. We combine creative direction, live operations, progression design, and publishing support to turn strong ideas into durable worlds.",
    pillars: [
      {
        title: "We design the play.",
        body: "We shape clear game loops, satisfying progression, and polished worlds that feel good from the first session.",
      },
      {
        title: "We grow what works.",
        body: "We grow experiences with live updates, player insights, and systems built to support steady long-term momentum.",
      },
      {
        title: "We publish with creators.",
        body: "We work with creators and studios to bring promising Roblox projects into a stronger publishing ecosystem.",
      },
    ],
  },
  experiences: {
    eyebrow: "Experiences",
    title: "Featured Experiences",
    subtitle: "Explore our most active Roblox experiences.",
  },
  games: [
    {
      name: "Tapping Frenzy",
      studio: "BuildUp Games",
      placeId: 93666013808960,
      img: "https://images.fillout.com/orgid-720100/flowpublicid-hmhysps8op/widgetid-default/uAXs1yKTVJwB2B4wSbNcGs/pasted-image-1780762902432-a5cjxe2q.png",
      url: "https://www.roblox.com/games/93666013808960/Tapping-Frenzy",
      tag: "Featured",
    },
  ],
  team: {
    eyebrow: "People",
    title: "Our Team",
    subtitle: "The leaders behind BuildUp.",
    members: [
      {
        name: "danxboii",
        role: "Chief Executive Officer",
        img: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-7E144DA4A088DD490E99731B6E8AB554-Png/420/420/AvatarHeadshot/Png/noFilter",
        url: "https://www.roblox.com/users/2929716136/profile",
      },
      {
        name: "ShaysDevs",
        role: "Chief Operating Officer",
        img: "https://images.fillout.com/orgid-720100/flowpublicid-hmhysps8op/widgetid-default/6gTMX4fq9bGovu4zhC7qKd/pasted-image-1780736990599-f90y4fby.png",
        url: "#",
      },
    ],
  },
  contact: {
    eyebrow: "Get in touch",
    title: "Bring BuildUp the next Roblox hit.",
    body: "Interested in working with us? We'd love to hear from you. Reach out for publishing, live operations, creator collaboration, or development support.",
    email: "contact@buildupgames.org",
    options: [
      {
        tag: "Pitch",
        title: "New Concepts",
        body: "Send a prototype, design direction, or early idea that deserves a stronger production path.",
      },
      {
        tag: "Partner",
        title: "Studio Support",
        body: "Reach out for publishing, live operations, creator collaboration, or development support.",
      },
      {
        tag: "Portfolio",
        title: "Game Sales",
        body: "Talk with us about acquisition opportunities and moving your experience into BuildUp.",
      },
    ],
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} BuildUp Games. All rights reserved.`,
    built: "Crafted with care in the Roblox ecosystem.",
  },
  nav: [
    { label: "About", href: "#about" },
    { label: "Experiences", href: "#experiences" },
    { label: "Team", href: "#team" },
    { label: "Contact", href: "#contact" },
  ],
  social: {
    roblox: "https://www.roblox.com/groups/buildup",
    twitter: "https://twitter.com/buildupgames",
    discord: "https://discord.gg/buildup",
  },
};

export type SiteConfig = typeof siteConfig;
