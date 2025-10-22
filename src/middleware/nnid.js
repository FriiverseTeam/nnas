const { create } = require('xmlbuilder');
const database = require('../database');
const { logger } = require('../logger');

const NNIDMiddleware = async (req, res, next) => {
    const authorization = req.headers['authorization'];

    if (!authorization || (!authorization.startsWith('Bearer') && !authorization.startsWith('Basic'))) {
        next();
        return;
    }

    const [scheme, credentials] = authorization.split(' ');

    let nnid;

    try {
        nnid = scheme === 'Basic'
            ? await database.getNNIDByBasicAuth(credentials)
            : await database.getNNIDByTokenAuth(credentials);

        if (!nnid) {
            const errorCode = scheme === 'Bearer' ? '0005' : '1105';
            const errorMessage = scheme === 'Bearer'
                ? 'Invalid access token'
                : 'Email address, username, or password, is not valid';
            const response = create({
                errors: {
                    error: {
                        cause: scheme === 'Bearer' ? 'access_token' : undefined,
                        code: errorCode,
                        message: errorMessage
                    }
                }
            }).end();
            return res.status(400).send(response);
        }

        if (nnid.deleted) {
            const response = create({
                error: {
                    code: '0112',
                    message: nnid.username
                }
            }).end();
            return res.status(400).send(response);
        }

        if (nnid.account_level < 0) {
            const response = create({
                errors: {
                    error: {
                        code: '0108',
                        message: 'Account has been banned'
                    }
                }
            }).end();
            return res.status(400).send(response);
        }

        req.nnid = nnid;
        next();
    } catch (error) {
        logger.error(`NNID middleware error: ${String(error)}`);
        next(error);
    }
};

module.exports = { NNIDMiddleware };