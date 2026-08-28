/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/strapi-api/:path*',
        destination: process.env.NEXT_PUBLIC_STRAPI_URL 
          ? `${process.env.NEXT_PUBLIC_STRAPI_URL}/:path*`
          : 'http://localhost:1337/api/:path*',
      },
    ];
  },
};

export default nextConfig;
