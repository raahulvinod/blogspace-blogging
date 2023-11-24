import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import connectDb from './config/dbConnect.js';
import userRouter from './routes/user.route.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 4000;

connectDb();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1', userRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
