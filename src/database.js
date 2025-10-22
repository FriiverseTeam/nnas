require('reflect-metadata');
const bcrypt = require('bcrypt');
const hash = require('./hash');
const dotenv = require('dotenv');
const { logger } = require('./logger');
const { DataSource } = require('typeorm');
const { NEXAccount } = require('./entities/nex-account');
const { NNID } = require('./entities/nnid');
const { Server } = require('./entities/server');
const { Device, DeviceAttribute } = require('./entities/device');

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: String(process.env.DB_HOST),
    port: Number(process.env.DB_PORT),
    username: String(process.env.DB_USERNAME),
    password: String(process.env.DB_PASSWORD),
    database: String(process.env.DB_NAME),
    synchronize: true, // ⚠️ Dev only
    logging: false,
    entities: [NEXAccount, NNID, Server, Device, DeviceAttribute],
    subscribers: [],
});

const initializeDatabase = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            logger.database('Database connected successfully!');
        }
    } catch (err) {
        logger.error(`Error connecting to the database: ${String(err)}`);
        process.exit(1);
    }
};

const getNNIDByTokenAuth = async (token) => {
    try {
        const decryptedToken = hash.decryptToken(Buffer.from(token, 'hex'));
        const unpackedToken = hash.unpackToken(decryptedToken);

        const nnidRepo = AppDataSource.getRepository(NNID);

        const nnid = await nnidRepo.findOneBy({ pid: unpackedToken.pid });
        if (!nnid) return null;

        const expireTime = Math.floor(Number(unpackedToken.expire_time) / 1000);
        if (Math.floor(Date.now() / 1000) > expireTime) {
            return null;
        }

        return nnid;
    } catch (error) {
        logger.error(`Error: ${String(error)}`);
        return null;
    }
};

const getNNIDByBasicAuth = async (token) => {
    try {
        const decoded = Buffer.from(token, 'base64').toString();
        const parts = decoded.split(' ');

        const username = parts[0];
        const password = parts[1];

        const nnidRepo = AppDataSource.getRepository(NNID);

        const nnid = await nnidRepo.findOneBy({ username });
        if (!nnid) return null;

        const hashedPassword = hash.nintendoPasswordHash(password, nnid.pid);

        const isValid = bcrypt.compareSync(hashedPassword, nnid.password);
        if (!isValid) return null;

        return nnid;
    } catch (error) {
        logger.error(`Error: ${String(error)}`);
        return null;
    }
};

const getNNIDByUsername = async (username) => {
    try {
        if (!AppDataSource.isInitialized) {
            logger.error('Database not initialized');
            return null;
        }

        if (typeof username !== 'string') {
            return null;
        }

        const nnidRepo = AppDataSource.getRepository(NNID);

        const nnid = await nnidRepo.findOneBy({ usernameLower: username.toLowerCase() });
        
        return nnid || null;
    } catch (error) {
        logger.error(`Error: ${String(error)}`);
        return null;
    }
};

module.exports = {
    AppDataSource,
    initializeDatabase,
    getNNIDByTokenAuth,
    getNNIDByBasicAuth,
    getNNIDByUsername
};