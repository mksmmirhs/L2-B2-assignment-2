import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { UserRoutes } from './app/modules/user/user.routes';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

// setting routes of api to user routes
app.use('/api', UserRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome api is running');
});

// response for invalid url

app.all('*', (req: Request, res: Response) => {
  res.json({
    success: false,
    message: 'Invalid url',
    error: {
      code: 404,
      description: 'Sorry the url is not valid',
    },
  });
});

export default app;
