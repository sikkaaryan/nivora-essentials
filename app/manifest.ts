import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NIVORA ESSENTIALS",
    short_name: "NIVORA",
    description: "Comfort for Every Body",
    start_url: "/",
    display: "standalone",
    background_color: "#111110",
    theme_color: "#111110",
    icons: [{ src: "/nivora-monogram.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
