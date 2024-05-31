import express from 'express';
import urlRouter from './routes/url.js';

const app = express();
const PORT = 3000;

app.use('/api', urlRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});