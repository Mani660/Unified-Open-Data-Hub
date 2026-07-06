import type { NextConfig } from "next";

// Bypass SSL certificate issues locally (e.g., for Google OAuth and fetch calls behind local firewalls/proxies)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const nextConfig: NextConfig = {
  reactStrictMode: true
};

export default nextConfig;
