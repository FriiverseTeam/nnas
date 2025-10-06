const { Router } = require('express');
const { logger } = require('../logger');
const path = require('path');

const routes = Router();

routes.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});

logger.info(`CONNTEST routes loaded!`);

module.exports = routes;