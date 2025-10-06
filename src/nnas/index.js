const { Router } = require('express');
const subdomain = require('express-subdomain');
const { logger } = require('../logger');

const v1 = require('./v1');

const nnas = Router();

nnas.use('/v1', v1);

const router = Router();

logger.info('NNAS routes loaded!');

router.use(subdomain('account', nnas));

module.exports = router;