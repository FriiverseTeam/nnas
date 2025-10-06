const express = require('express');
const { logger } = require('./logger');
require('dotenv').config();

const nnas = require('./nnas');

const app = express();

app.use(express.json());

app.use('/v1/api', nnas);

app.listen(process.env.HTTP_PORT, () => {
  logger.success(`Server is running on port ${process.env.HTTP_PORT}`);
});