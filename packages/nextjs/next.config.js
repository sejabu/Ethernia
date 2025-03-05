// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

module.exports = nextConfig;

// module.exports = {
//   async headers() {
//     return [
//       {
//         source: '/(.*)',
//         headers: [
//           {
//             key: 'X-Content-Type-Options',
//             value: 'nosniff',
//           },
//           {
//             key: 'X-Frame-Options',
//             value: 'DENY',
//           },
//           {
//             key: 'Referrer-Policy',
//             value: 'strict-origin-when-cross-origin',
//           },
//         ],
//       },
//       {
//         source: '/sw.js',
//         headers: [
//           {
//             key: 'Content-Type',
//             value: 'application/javascript; charset=utf-8',
//           },
//           {
//             key: 'Cache-Control',
//             value: 'no-cache, no-store, must-revalidate',
//           },
//           {
//             key: 'Content-Security-Policy',
//             value: "default-src 'self'; script-src 'self'",
//           },
//         ],
//       },
//     ]
//   },
// }