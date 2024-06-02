import fs from 'fs';
import path from 'path';
import schedule from 'node-schedule';
import dotenv from 'dotenv';

dotenv.config();

const LOG_PATH = path.resolve(process.env.LOG_PATH);
const ACCESS_LOG_PATH = path.join(LOG_PATH, 'access.log');
const ERROR_LOG_PATH = path.join(LOG_PATH, 'error.log');

const clearLogs = () => {
  try {
    fs.writeFileSync(ACCESS_LOG_PATH, '');
    console.log('Access log cleared successfully.');

    fs.writeFileSync(ERROR_LOG_PATH, '');
    console.log('Error log cleared successfully.');
  } catch (error) {
    console.error('Error clearing logs:', error);
  }
};

const job = schedule.scheduleJob('0 0 * * 0', clearLogs);

export default job;
