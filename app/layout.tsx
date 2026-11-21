import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Ainimight — Design studio for brands, packaging & book covers",
  description:
    "Ainimight is an independent design studio drawing brand identities, packaging, illustration and book covers. Makers of Loomi, Sarrohi and Gentle Disorder.",
  icons: { icon: "./favicon.png" },
}
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=Inter+Tight:wght@300..800&family=Instrument+Serif:ital@0;1&family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
