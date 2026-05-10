/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@isms/shared"],
  output: "standalone",
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;