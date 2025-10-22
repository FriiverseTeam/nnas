const express = require('express');
const dotenv = require('dotenv');
const { logger } = require('./logger');
const { initializeDatabase } = require('./database');

const conntest = require('./serv/conntest');
const nnas = require('./serv/nnas');

dotenv.config();

const serve = express();

serve.use(express.json());

serve.use(conntest);
serve.use(nnas);

serve.use((req, res) => {
    res.status(404);
    res.json({ 
        error: 'Not Found',
        code: 404
    });
});

serve.listen(process.env.HTTP_PORT, async () => {
    await initializeDatabase();
    logger.success(`NNAS Server is running on port ${process.env.HTTP_PORT}.`);
});