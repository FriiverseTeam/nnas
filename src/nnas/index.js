const { Router } = require('express');
const { logger } = require('../logger');
const subdomain = require('express-subdomain');

const nnas = Router();

nnas.use('/admin', require('./admin'));
nnas.use('/content', require('./content'));
nnas.use('/devices', require('./devices'));
nnas.use('/support', require('./support'));

logger.info(`NNAS routes loaded!`);

const routes = Router();

routes.use(subdomain('account', nnas));

module.exports = routes;