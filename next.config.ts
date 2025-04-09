import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com"], // Add the domain here
  },
  eslint:{
    ignoreDuringBuilds: true
}
};

export default nextConfig;