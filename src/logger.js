const colors = require('colors');

colors.enable();

logger = {
    success: (message) => {
        console.log(colors.green(`[SUCCESS] ${message}`));
    },
    info: (message) => {
        console.log(colors.blue(`[INFO] ${message}`));
    },
    warn: (message) => {
        console.log(colors.yellow(`[WARN] ${message}`));
    },
    error: (message) => {
        console.log(colors.red(`[ERROR] ${message}`));
    }
};

module.exports = { logger };