/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://mqixjzolgrdzbwzkrzxz.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xaXhqem9sZ3JkemJ3emtyenh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMTI5MDYsImV4cCI6MjA4OTU4ODkwNn0.Hfgk65ex1jR9A8ZJ6DyLPtIpOHzXPNkHCtUOOe-YUH8",
    SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xaXhqem9sZ3JkemJ3emtyenh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAxMjkwNiwiZXhwIjoyMDg5NTg4OTA2fQ.hs0L0cFWc4kmHYsWjuYhtDuKkyPEeIOayUauz6ScR5k",
  },
}

module.exports = nextConfig
