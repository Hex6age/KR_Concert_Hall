import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import UserController from './controllers/UserController.js';
import EventController from './controllers/EventController.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3010;

app.use(cors());
app.use(express.json());

// Подключаем наши контроллеры
app.use('/api/auth', UserController);
app.use('/api/events', EventController);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});