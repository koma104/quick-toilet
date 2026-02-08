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
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
