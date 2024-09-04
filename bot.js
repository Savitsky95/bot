const TelegramBot = require('node-telegram-bot-api');

// Вставьте свой токен
const token = '7262257493:AAFMAWxf9CN21DT3GP7HWm4lYw3pItQvURc';
const bot = new TelegramBot(token, { polling: true });

const options = {
    reply_markup: {
        keyboard: [
            ['ТО', 'ВТМ'],
            ['Перезапустити бот']
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    }
};

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Виберіть тип розрахунку:', options);
});

// Обработка кнопок "ТО" и "ВТМ"
bot.onText(/ТО|ВТМ/, (msg, match) => {
    const chatId = msg.chat.id;
    const type = match[0];
    bot.sendMessage(chatId, `Введіть план для ${type}:`, options);
    
    bot.once('message', (msg) => {
        if (isCommand(msg.text)) return; // Игнорировать команды
        const plan = parseFloat(msg.text);
        if (isNaN(plan)) {
            return bot.sendMessage(chatId, 'Введіть числові значення.', options);
        }
        
        bot.sendMessage(chatId, `Введіть факт для ${type}:`, options);
        
        bot.once('message', (msg) => {
            if (isCommand(msg.text)) return; // Игнорировать команды
            const fact = parseFloat(msg.text);
            if (isNaN(fact)) {
                return bot.sendMessage(chatId, 'Введіть числові значення.', options);
            }
            
            calculateAndSendResult(chatId, type, plan, fact);
        });
    });
});

// Функция для расчета и отправки результата
function calculateAndSendResult(chatId, type, plan, fact) {
    let percentage, remaining100, remainingTarget, daily100, dailyTarget, daily100WithToday, dailyTargetWithToday;
    const daysInMonth = 30;
    const remainingDays = daysInMonth - new Date().getDate();

    percentage = (fact / plan) * 100;
    remaining100 = Math.max(plan - fact, 0);
    const target = (type === 'ТО') ? 95 : 98;
    remainingTarget = Math.max((target / 100) * plan - fact, 0);

    daily100 = remaining100 / remainingDays;
    dailyTarget = remainingTarget / remainingDays;
    daily100WithToday = remaining100 / (remainingDays + 1);
    dailyTargetWithToday = remainingTarget / (remainingDays + 1);

    bot.sendMessage(chatId, `Процент виконання плану: ${percentage.toFixed(2)}%`, options);
    bot.sendMessage(chatId, `Залишилось до 100%: ${remaining100.toFixed(2)} грн`, options);
    bot.sendMessage(chatId, `Залишилось до ${target}%: ${remainingTarget.toFixed(2)} грн`, options);
    bot.sendMessage(chatId, `Сума продажів на день до 100% (без урахування сьогодні): ${daily100.toFixed(2)} грн`, options);
    bot.sendMessage(chatId, `Сума продажів на день до ${target}% (без урахування сьогодні): ${dailyTarget.toFixed(2)} грн`, options);
    bot.sendMessage(chatId, `Сума продажів на день до 100% (з урахуванням сьогодні): ${daily100WithToday.toFixed(2)} грн`, options);
    bot.sendMessage(chatId, `Сума продажів на день до ${target}% (з урахуванням сьогодні): ${dailyTargetWithToday.toFixed(2)} грн`, options);
}

// Функция проверки на команду
function isCommand(text) {
    return ['/start', 'ТО', 'ВТМ', 'Перезапустити бот'].includes(text);
}

// Обработка кнопки перезапуска бота
bot.onText(/Перезапустити бот/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Бот перезапущено. Виберіть тип розрахунку:', options)
        .then(() => process.exit(0))
        .catch(error => console.error('Error sending restart message:', error));
});

// Обработка ошибок
bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});
