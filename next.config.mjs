/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn-images.dzcdn.net', 'api.deezer.com', 'cdns-images.dzcdn.net', "cdn-icons-png.flaticon.com"],
  },
  async rewrites() {
    return [
      {
        source: '/api/deezer/:path*',
        destination: 'https://api.deezer.com/:path*',
      },
    ];
  },
};

export default nextConfig;