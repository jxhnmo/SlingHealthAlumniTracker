/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: process.env.NEXT_PUBLIC_API_BASE_URL }, // replace this your actual origin
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  },
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: [process.env.PINATA_GATEWAY],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias["@babel/preset-env"] =
        require.resolve("@babel/preset-env");
    }
    return config;
  },
};


module.exports = nextConfig;
