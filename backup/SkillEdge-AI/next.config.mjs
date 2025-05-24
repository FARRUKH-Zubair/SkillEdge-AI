/** @type {import('next').NextConfig} */

// Import config file with hardcoded environment variables
import envConfig from './config.env.js';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "www.pngplay.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  env: {
    DATABASE_URL: envConfig.DATABASE_URL,
    NEXT_PUBLIC_SUPABASE_URL: envConfig.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
};

export default nextConfig;
