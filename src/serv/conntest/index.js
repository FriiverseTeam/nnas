const { Router } = require('express');
const subdomain = require('express-subdomain');
const { logger } = require('../../logger');

const conntest = Router();

conntest.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.set('X-Organization', 'Nintendo');
  res.send('OK.');
});

const router = Router();

router.use(subdomain('conntest', conntest));

logger.info('Conntest routes initialized!');

module.exports = router;