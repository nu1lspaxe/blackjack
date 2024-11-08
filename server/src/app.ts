import express, { Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

export default app;
