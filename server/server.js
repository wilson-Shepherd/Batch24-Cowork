import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import urlRouter from './routes/url.js';
import redirectRouter from './routes/redirectUrl.js'
import { errorHandler } from './middleware/errorHandler.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import './middleware/logCleaner.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const LOG_PATH = path.resolve(process.env.LOG_PATH);
const ORIGIN = process.env.ORIGIN;

if (!fs.existsSync(LOG_PATH)) {
  fs.mkdirSync(LOG_PATH, { recursive: true });
}

const accessLogStream = fs.createWriteStream(path.join(LOG_PATH, 'access.log'), { flags: 'a' });
const errorLogStream = fs.createWriteStream(path.join(LOG_PATH, 'error.log'), { flags: 'a' });

app.use(cors({
  origin: ORIGIN
}));

app.use(express.json());
app.use(morgan('combined', { stream: accessLogStream }));

app.use((err, req, res, next) => {
  const logMessage = `${new Date().toISOString()} - ${err.message}\n${err.stack}\n`;
  errorLogStream.write(logMessage);
  next(err);
});

app.use('/api', urlRouter);

app.use('/', redirectRouter)

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
