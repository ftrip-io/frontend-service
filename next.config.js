/** @type {import('next').NextConfig} */
require("dotenv").config;

const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/userService/:path*",
        destination: `${
          process.env.API_PROXY_URL
            ? process.env.API_PROXY_URL + "/userService"
            : "http://localhost:4999"
        }/:path*`,
      },
      {
        source: "/notificationService/:path*",
        destination: `${
          process.env.API_PROXY_URL
            ? process.env.API_PROXY_URL + "/notificationService"
            : "http://localhost:4998"
        }/:path*`,
      },
      {
        source: "/catalogService/:path*",
        destination: `${
          process.env.API_PROXY_URL
            ? process.env.API_PROXY_URL + "catalogService"
            : "http://localhost:4999"
        }/:path*`,
      },
      {
        source: "/photoService/:path*",
        destination: `${
          process.env.API_PROXY_URL
            ? process.env.API_PROXY_URL + "photoService"
            : "http://localhost:3001"
        }/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
