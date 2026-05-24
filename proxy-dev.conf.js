const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: 'http://localhost:8080',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    headers: {
      'x-forwarded-host': 'localhost',
      'x-forwarded-proto': 'https',
    },
  },
];

module.exports = PROXY_CONFIG;
