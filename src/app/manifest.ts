import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Quick Toilet",
    short_name: "Quick Toilet",
    description: "近くのトイレを3件表示。タップで地図とナビを開けます。",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0EA5E9",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
