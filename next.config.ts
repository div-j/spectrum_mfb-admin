
  /* config options here */
  module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // The incoming request path pattern from your frontend
        destination: 'https://gateway.spectrumpay.com.ng:4010/:path*', // The actual destination of the external API
      },
    ];
  },
};

