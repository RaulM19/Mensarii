import type {NextConfig} from 'next';
import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  manifest: {
    name: 'Mensarii',
    short_name: 'Mensarii',
    description: 'Manage your savings arcas with ease.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#007BFF',
    icons: [
      {
        src: '/icon.svg',
        sizes: '48x48',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.svg',
        sizes: '72x72',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.svg',
        sizes: '96x96',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.svg',
        sizes: '144x144',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  },
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA(nextConfig);
