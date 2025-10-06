const colors = require('colors');

colors.enable();

function getCurrentTimestamp() {
    const now = new Date();
    return now.toISOString();
}

logger = {
    success: (message) => {
        console.log(colors.green(`[${getCurrentTimestamp()}] ` + `[SUCCESS] ${message}`));
    },
    info: (message) => {
        console.log(colors.blue(`[${getCurrentTimestamp()}] ` + `[INFO] ${message}`));
    },
    warn: (message) => {
        console.log(colors.yellow(`[${getCurrentTimestamp()}] ` + `[WARN] ${message}`));
    },
    error: (message) => {
        console.log(colors.red(`[${getCurrentTimestamp()}] ` + `[ERROR] ${message}`));
    }
};

module.exports = { logger };