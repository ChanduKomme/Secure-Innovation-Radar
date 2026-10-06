export const meta = (title: string, description: string) => ({
  meta: [
    { title: `${title} — Secure Innovation Radar` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — Secure Innovation Radar` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
