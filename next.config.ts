module.exports = {
  output: 'standalone', // Add this line for Docker deployment
   eslint: {
    ignoreDuringBuilds: true, // disables ESLint checks during build
  },
    typescript: {
    ignoreBuildErrors: true, // SKIPS type checking errors
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://gateway.spectrumpay.com.ng:4010/:path*',
      },
    ];
  },
};