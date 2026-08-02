/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const legacyOrigin = process.env.LEGACY_CRA_ORIGIN?.replace(/\/$/, '');
    if (!legacyOrigin) return { beforeFiles: [] };
    const proxy = (source) => ({ source, destination: `${legacyOrigin}${source}` });
    return {
      // App Router's not-found boundary runs before fallback rewrites. These
      // audited legacy paths must therefore proxy before Next resolves routes.
      // Do not add /, /en, /hi, /_next, robots, sitemap, or verification here.
      beforeFiles: [
        ...['/test/:path*', '/result/:path*', '/report/:path*', '/premium-report/:path*', '/types/:path*', '/about/:path*', '/privacy/:path*', '/terms/:path*', '/contact/:path*', '/compare/:path+', '/community/:path*', '/login/:path*', '/signup/:path*', '/forgot-password/:path*', '/reset-password/:path*', '/api/:path*', '/static/:path*'].map(proxy),
        ...['/asset-manifest.json', '/manifest.json', '/favicon.ico', '/service-worker.js', '/index.html'].map(proxy),
      ],
    };
  },
};

export default nextConfig;
