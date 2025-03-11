import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    short_name: "Ethernia",
    name: "Ethernia DApp",
    description: "Crypto Inheritance Made Easy ",
    start_url: "/dashboard",
    display: "fullscreen",
    theme_color:"#ffffff",
    background_color:"#ffffff",
    icons: [
      {
        src:"/android-chrome-192x192.png",
        sizes:"192x192",
        type:"image/png",
      },
      {
        src:"/android-chrome-512x512.png",
        sizes:"512x512",
        type:"image/png",
      },
      {
      src: '/favicon.ico',
      sizes: 'any',
      type: 'image/x-icon',
      }
    ],
    
  }
}