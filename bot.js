const TelegramBot = require('node-telegram-bot-api');

// Вставьте сюда ваш токен
const token = '7262257493:AAFMAWxf9CN21DT3GP7HWm4lYw3pItQvURc';

// Создайте бота и подключитесь к Telegram
const bot = new TelegramBot(token, { polling: true });

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Привет! Я ваш бот. Как я могу помочь?');
});

// Обработка текстовых сообщений
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Пример расчета (замените на ваш расчет)
  if (text === 'Расчет ТО') {
    const result = 'Результат расчета ТО';
    bot.sendMessage(chatId, `Результат расчета ТО: ${result}`);
  } else if (text === 'Расчет ВТМ') {
    const result = 'Результат расчета ВТМ';
    bot.sendMessage(chatId, `Результат расчета ВТМ: ${result}`);
  }
});

console.log('Бот запущен');
