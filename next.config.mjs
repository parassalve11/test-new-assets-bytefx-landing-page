/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.1.105"],

  /**
   * `/company/legal` is what the footer's Company column links to; `/legal` is
   * what the legal column links to. They are the same hub, so one redirects to
   * the other rather than existing twice. Permanent, because the canonical URL
   * is `/legal` and search engines should stop asking about the other one.
   */
  async redirects() {
    return [
      { source: "/company/legal", destination: "/legal", permanent: true },
    ];
  },
};

export default nextConfig;
