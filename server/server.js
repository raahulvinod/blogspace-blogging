import express from 'express';
import 'dotenv/config';
import connectDb from './config/dbConnect.js';

const app = express();
const PORT = process.env.PORT || 4000;

connectDb();

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
