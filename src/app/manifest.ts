import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FlotaApp - Zarządzanie flotą",
    short_name: "FlotaApp",
    description: "Aplikacja do zarządzania flotą pojazdów transportowych",
    start_url: "/",
    display: "standalone",
    theme_color: "#171717",
    background_color: "#ffffff",
    lang: "pl",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
