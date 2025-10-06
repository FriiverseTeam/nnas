const { Router } = require('express');
const { logger } = require('../logger');

const routes = Router();

routes.use('/admin', require('./admin'));
routes.use('/content', require('./content'));
routes.use('/devices', require('./devices'));

logger.info('NNAS routes loaded !');

module.exports = routes;