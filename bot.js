const TelegramBot = require('node-telegram-bot-api');

// Вставьте свой токен
const token = '7262257493:AAFMAWxf9CN21DT3GP7HWm4lYw3pItQvURc';
const bot = new TelegramBot(token, { polling: true });

// Слушаем сообщения
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
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
    bot.sendMessage(chatId, 'Виберіть тип розрахунку:', options)
        .catch(error => console.error('Error sending start message:', error));
});

bot.onText(/ТО|ВТМ/, (msg, match) => {
    const chatId = msg.chat.id;
    const type = match[0];
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
    bot.sendMessage(chatId, `Введіть план для ${type}`, options)
        .catch(error => console.error('Error sending plan request:', error));

    bot.once('message', (msg) => {
        if (msg.text === '/start' || msg.text === 'ТО' || msg.text === 'ВТМ' || msg.text === 'Перезапустити бот') {
            return; // Игнорировать сообщения, которые не являются планом
        }

        const plan = parseFloat(msg.text);
        bot.sendMessage(chatId, `Введіть факт для ${type}`, options)
            .catch(error => console.error('Error sending fact request:', error));

        bot.once('message', (msg) => {
            const fact = parseFloat(msg.text);

            if (isNaN(plan) || isNaN(fact)) {
                bot.sendMessage(chatId, 'Введіть числові значення.', options)
                    .catch(error => console.error('Error sending invalid input message:', error));
                return;
            }

            let percentage, remaining100, remainingTarget, daily100, dailyTarget, daily100WithToday, dailyTargetWithToday;
            const daysInMonth = 30; // Предполагаемое количество дней в месяце
            const remainingDays = daysInMonth - new Date().getDate(); // Количество оставшихся дней в месяце

            if (type === 'ТО') {
                percentage = (fact / plan) * 100;
                remaining100 = Math.max(plan - fact, 0);
                remainingTarget = Math.max((95 / 100) * plan - fact, 0);

                daily100 = remaining100 / remainingDays;
                dailyTarget = remainingTarget / remainingDays;

                daily100WithToday = remaining100 / (remainingDays + 1);
                dailyTargetWithToday = remainingTarget / (remainingDays + 1);

                bot.sendMessage(chatId, `Процент виконання плану: ${percentage.toFixed(2)}%`, options)
                    .catch(error => console.error('Error sending percentage message:', error));
                bot.sendMessage(chatId, `Залишилось до 100%: ${remaining100.toFixed(2)} грн`, options)
                    .catch(error => console.error('Error sending remaining 100% message:', error));
                bot.sendMessage(chatId, `Залишилось до 95%: ${remainingTarget.toFixed(2)} грн`, options)
                    .catch(error => console.error('Error sending remaining 95% message:', error));
                bot.sendMessage(chatId, `Сума продажів на день до 100% (без урахування сьогодні): ${daily100.toFixed(2)} грн`, options)
                    .catch(error => console.error('Error sending daily 100% without today message:', error));
                bot.sendMessage(chatId, `Сума продажів на день до 95% (без урахування сьогодні): ${dailyTarget.toFixed(2)} грн`, options)
                    .catch(error => console.error('Error sending daily 95% without today message:', error));
                bot.sendMessage(chatId, `Сума продажів на день до 100% (з урахуванням сьогодні): ${daily100WithToday.toFixed(2)} грн`, options)
                    .catch(error => console.error('Error sending daily 100% with today message:', error));
                bot.sendMessage(chatId, `Сума продажів на день до 95% (з урахуванням сьогодні): ${dailyTargetWithToday.toFixed(2)} грн`, options)
                    .catch(error => console.error('Error sending daily 95% with today message:', error));
            } else if (type === 'ВТМ') {
                percentage = (fact / plan) * 100;
                remaining100 = Math.max(plan - fact, 0);
                remainingTarget = Math.max((98 / 100) * plan - fact, 0);

                daily100 = remaining100 / remainingDays;
                dailyTarget = remainingTarget / remainingDays;

                daily100WithToday = remaining100 / (remainingDays + 1);
                dailyTargetWithToday = remainingTarget / (remainingDays + 1);

                bot.sendMessage(chatId, `Процент виконання плану: ${percentage.toFixed(2)}%`, options)
                    .catch(error => console.error('Error sending percentage message:', error));
                bot.sendMessage(chatId, `Залишилось до 100%: ${remaining100.toFixed(2)} грн`, options)
                    .catch(error => console.error('Error sending remaining 100% message:', error));
                bot.sendMessage(chatId, `Залишилось до 98%: ${remainingTarget.toFixed(2)} грн`, options)
                    .catch(error => console.error('Error sending remaining 98% message:', error));
                bot.sendMessage(chatId, `Сума продажів на день до 100% (без урахування сьогодні): ${daily100.toFixed(2)} грн`, options)
                    .catch(error => console.error('Error sending daily 100% without today message:', error));
                bot.sendMessage(chatId, `Сума продажів на день до 98% (без урахування сьогодні): ${dailyTarget.toFixed(2)} грн`, options)
                    .catch(error => console.error('Error sending daily 98% without today message:', error));
                bot.sendMessage(chatId, `Сума продажів на день до 100% (з урахуванням сьогодні): ${daily100WithToday.toFixed(2)} грн`, options)
                    .catch(error => console.error('Error sending daily 100% with today message:', error));
                bot.sendMessage(chatId, `Сума продажів на день до 98% (з урахуванням сьогодні): ${dailyTargetWithToday.toFixed(2)} грн`, options)
                    .catch(error => console.error('Error sending daily 98% with today message:', error));
            }
        });
    });
});

// Обработка кнопки перезапуска бота
bot.onText(/Перезапустити бот/, (msg) => {
    const chatId = msg.chat.id;
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

    bot.sendMessage(chatId, 'Бот перезапущено. Виберіть тип розрахунку:', options)
        .catch(error => console.error('Error sending restart message:', error));
    
    // Перезапуск бота
    process.exit(0); // Завершить текущий процесс, чтобы PM2 или другой процесс-менеджер автоматически перезапустил его
});

bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});
