import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import { personRouter } from './routes/personRoutes';

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/health', (_req, res) => {
  res.json({ data: { status: 'ok' } });
});

app.use('/api/people', personRouter);

app.use(errorHandler);

export default app;
