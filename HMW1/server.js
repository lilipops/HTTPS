const fs = require('fs');
const express = require('express');
const router = express.Router();

// Контроллер для эндпоинта /get
router.get('/get', (req, res) => {
  try {
    // Читаем содержимое директории files и возвращаем имена файлов через запятую
    const files = fs.readdirSync('./files');
    res.send(files.join(', '));
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Контроллер для эндпоинта /delete
router.delete('/delete', (req, res) => {
  res.status(200).send('success');
});

// Контроллер для эндпоинта /post
router.post('/post', (req, res) => {
  res.status(200).send('success');
});

// Контроллер для эндпоинта /redirect
router.get('/redirect', (req, res) => {
  res.redirect(301, '/redirected');
});

// Обработчик всех остальных запросов
router.all('*', (req, res) => {
  res.status(405).send('HTTP method not allowed');
});

module.exports = router;
