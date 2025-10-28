/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_BFF_URL: process.env.NEXT_PUBLIC_BFF_URL || 'https://pwa-push-demo-bff.fleatoke.workers.dev',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qcxnwhfmfskaqxryzptz.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjeG53aGZtZnNrYXF4cnl6cHR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MTU1MjMsImV4cCI6MjA3NzE5MTUyM30.folnOdee06XZ0o_Gz5mzuQyphXXVeJiLSJnpApulwig',
    // FCM VAPID Key
    NEXT_PUBLIC_FCM_VAPID_KEY:
      process.env.NEXT_PUBLIC_FCM_VAPID_KEY ||
      'BE2iSLa-FL5AVipAlX83gtTLbWhO52btG2t4w7lTRwyTgBRaDNKCHMs_YsYVJq6qkLFIIDZ8Y8J21GCDnLvoEeo',
  },
}

module.exports = nextConfig

