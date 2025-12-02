module.exports = {
  output: 'standalone', // Add this line for Docker deployment
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://gateway.spectrumpay.com.ng:4010/:path*',
      },
    ];
  },
};