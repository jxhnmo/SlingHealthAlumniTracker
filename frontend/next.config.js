/** @type {import('next').NextConfig} */
const nextConfig = {
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
