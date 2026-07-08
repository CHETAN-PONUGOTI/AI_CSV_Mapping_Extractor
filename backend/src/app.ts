import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiRoutes } from './routes/api.routes';
import { errorHandler } from './middleware/error.handler';
import { rateLimiter } from './middleware/rate.limiter';

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-project.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(rateLimiter);

app.use('/api', apiRoutes);
app.use(errorHandler);

export { app };