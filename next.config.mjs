/** @type {import('next').NextConfig} */
export default {
  output: "export",
  assetPrefix: "./",
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
  reactStrictMode: false,
}
