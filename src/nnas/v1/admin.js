const { Router } = require('express');

const routes = Router();

routes.get('/time', (req, res) => {
  const now = Date.now();
  const utcDate = new Date().toUTCString();
  res.setHeader('X-Nintendo-Date', String(now));
  res.setHeader('Server', 'Nintendo 3DS (http)');
  res.setHeader('Date', utcDate);
  res.end();
});

module.exports = routes;