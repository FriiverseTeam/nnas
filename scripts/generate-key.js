const chalk = require('chalk');
const fs = require('fs');
const crypto = require('crypto');

const ENV_FILE = '.env';

console.log(chalk.blue('Generating AES Key...'));

const AES_KEY = crypto.randomBytes(32).toString('hex');

if (fs.existsSync(ENV_FILE)) {
  const content = fs.readFileSync(ENV_FILE, 'utf-8');
  if (content.includes('AES_KEY=')) {
    fs.writeFileSync(ENV_FILE, content.replace(/AES_KEY=.*/, `AES_KEY=${AES_KEY}`));
  } else {
    fs.appendFileSync(ENV_FILE, `\nAES_KEY=${AES_KEY}`);
  }
} else {
  fs.writeFileSync(ENV_FILE, `AES_KEY=${AES_KEY}`);
}

console.log(chalk.green('AES Key generated successfully!'));
console.log(chalk.yellow(`Key: ${AES_KEY}`));