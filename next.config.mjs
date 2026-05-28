/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // ESLint is intentionally not installed in this scaffold; skip during builds.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
