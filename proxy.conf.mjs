export default {
  '/health': {
    target: 'http://localhost:3000',
    secure: false,
    bypass: function (req, res, proxyOptions) {
      if (req.url === '/health') {
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            status: 'UP',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
          }),
        );
        return true;
      }
    },
  },
};
