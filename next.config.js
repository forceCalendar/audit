/** @type {import('next').NextConfig} */
const nextConfig = {
  // The page is rendered with ISR (see `revalidate` in app/page.js) so the
  // tracker refreshes from GitHub without a redeploy; a static export would
  // freeze it at build time.
  reactStrictMode: true,
};

module.exports = nextConfig;
