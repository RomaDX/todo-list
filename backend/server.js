const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const tasksFilePath = path.join(__dirname, 'tasks.json');

// Middleware для обробки JSON і статичних файлів
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// API: Отримати всі завдання
app.get('/api/tasks', (req, res) => {
  fs.readFile(tasksFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read tasks' });
    res.json(JSON.parse(data || '[]'));
  });
});

// API: Додати нове завдання
app.post('/api/tasks', (req, res) => {
  const newTask = req.body;
  fs.readFile(tasksFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read tasks' });
    const tasks = JSON.parse(data || '[]');
    tasks.push(newTask);
    fs.writeFile(tasksFilePath, JSON.stringify(tasks), (err) => {
      if (err) return res.status(500).json({ error: 'Failed to save task' });
      res.status(201).json(newTask);
    });
  });
});

// API: Оновити завдання
app.put('/api/tasks/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  const updatedTask = req.body;
  fs.readFile(tasksFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read tasks' });
    const tasks = JSON.parse(data || '[]');
    tasks[index] = updatedTask;
    fs.writeFile(tasksFilePath, JSON.stringify(tasks), (err) => {
      if (err) return res.status(500).json({ error: 'Failed to update task' });
      res.json(updatedTask);
    });
  });
});

// API: Видалити завдання
app.delete('/api/tasks/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  fs.readFile(tasksFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read tasks' });
    const tasks = JSON.parse(data || '[]');
    tasks.splice(index, 1);
    fs.writeFile(tasksFilePath, JSON.stringify(tasks), (err) => {
      if (err) return res.status(500).json({ error: 'Failed to delete task' });
      res.status(204).end();
    });
  });
});

// Обробник для кореневого маршруту
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});