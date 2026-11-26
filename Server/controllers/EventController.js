import express from 'express';
import tableService from '../services/TableService.js';

const router = express.Router();

// GET: Получить все концерты
router.get('/', (req, res) => {
  const data = tableService._get('events');
  res.json(data.records);
});

// GET: Получить брони конкретного пользователя
router.get('/bookings/:userId', (req, res) => {
  const data = tableService._get('bookings');
  const userBookings = data.records.filter(b => b.userId === req.params.userId);
  res.json(userBookings);
});

// POST: Забронировать билет
router.post('/bookings', (req, res) => {
  const { userId, eventId, sessionId, seats } = req.body;
  const newBooking = { 
    id: `b${Date.now()}`, 
    userId, 
    eventId, 
    sessionId, // Сохраняем ID сеанса
    seats,
    status: 'active',
    createdAt: new Date().toLocaleDateString('ru-RU')
  };
  tableService._post('bookings', newBooking);
  res.json({ message: 'Бронь создана', booking: newBooking });
});

// PUT: Обновить данные брони (количество билетов ИЛИ статус)
router.put('/bookings/:id', (req, res) => {
  const updated = tableService._put('bookings', req.params.id, req.body);
  if (updated) {
    res.json({ message: 'Обновлено', booking: updated });
  } else {
    res.status(404).json({ message: 'Бронь не найдена' });
  }
});

// DELETE: Отменить бронь
router.delete('/bookings/:id', (req, res) => {
  const deleted = tableService._delete('bookings', req.params.id);
  if (deleted) res.json({ message: 'Удалено' });
  else res.status(404).json({ message: 'Бронь не найдена' });
});

export default router;