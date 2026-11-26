import express from 'express';
import tableService from '../services/TableService.js';

const router = express.Router();

// Вход в систему
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const data = tableService._get('users');
  const user = data.records.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({ message: 'Успешно', user });
  } else {
    res.status(401).json({ message: 'Неверный email или пароль' });
  }
});

// Регистрация
router.post('/register', (req, res) => {
  const { name, surname, email, password } = req.body;
  const data = tableService._get('users');
  
  if (data.records.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Пользователь уже существует' });
  }

  const newUser = { id: `u${Date.now()}`, name, surname, email, password };
  tableService._post('users', newUser);
  
  res.json({ message: 'Регистрация успешна', user: newUser });
});

export default router;