import type { NextConfig } from "next";

import withBundleAnalyzer from '@next/bundle-analyzer';
import createJiti from 'jiti';

const jiti = createJiti(import.meta.url);
jiti('./src/shared/libs/env');

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default bundleAnalyzer(nextConfig);
