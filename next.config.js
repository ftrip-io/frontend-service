const nextConfig = {
  reactStrictMode: false,
  publicRuntimeConfig: {
    imageServicePath: `http://${process.env.IMAGE_SERVICE_HOSTNAME || "localhost"}:${
      process.env.IMAGE_SERVICE_PORT || "3001"
    }`,
  },
  output: "standalone",
  swcMinify: true,
  async rewrites() {
    const proxy = process.env.API_PROXY_URL;
    return [
      {
        source: "/userService/:path*",
        destination: `${proxy ? proxy + "/userService" : "http://localhost:4999"}/:path*`,
      },
      {
        source: "/notificationService/:path*",
        destination: `${proxy ? proxy + "/notificationService" : "http://localhost:4998"}/:path*`,
      },
      {
        source: "/catalogService/:path*",
        destination: `${proxy ? proxy + "/catalogService" : "http://localhost:4997"}/:path*`,
      },
      {
        source: "/rtcService/:path*",
        destination: `${proxy ? proxy + "/rtcService" : "http://localhost:4996"}/:path*`,
      },
      {
        source: "/bookingService/:path*",
        destination: `${proxy ? proxy + "/bookingService" : "http://localhost:4995"}/:path*`,
      },
      {
        source: "/photoService/:path*",
        destination: `${proxy ? proxy + "/imageService" : "http://localhost:3001"}/:path*`,
      },
    ];
  },
  images: { domains: [process.env.IMAGE_SERVICE_HOSTNAME || "localhost"] },
};

module.exports = nextConfig;
