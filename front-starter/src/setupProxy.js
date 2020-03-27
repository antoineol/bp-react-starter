const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:4141',
      pathRewrite: { '^/api': '' },
      changeOrigin: true
      // ws: true,
    })
  );
};
