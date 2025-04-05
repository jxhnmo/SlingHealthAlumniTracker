/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: [process.env.PINATA_GATEWAY],
  },
};

module.exports = nextConfig;
