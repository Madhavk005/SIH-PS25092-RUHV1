/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // If you need to skip middleware URL normalization
  skipMiddlewareUrlNormalize: true,

  experimental: {
    // keep only valid experimental features here
    missingSuspenseWithCSRBailout: true,
  },
};

export default nextConfig;
