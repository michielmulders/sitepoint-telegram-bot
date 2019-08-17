require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;

// Created instance of TelegramBot
const bot = new TelegramBot(token, {
    polling: true
});

// In-memory storage
const URLs = [];
const URLLabels = [];
let tempSiteURL = '';

// Listener (handler) for telegram's /bookmark event
bot.onText(/\/bookmark/, (msg, match) => {
    const chatId = msg.chat.id;
    const url = match.input.split(' ')[1];

    if (url === undefined) {
        bot.sendMessage(
            chatId,
            'Please provide URL of article!',
        );
        return;
    }

    URLs.push(url);
    bot.sendMessage(
        chatId,
        'URL has been successfully saved!',
    );
});

// Listener (handler) for telegram's /label event
bot.onText(/\/label/, (msg, match) => {
    const chatId = msg.chat.id;
    const url = match.input.split(' ')[1];

    if (url === undefined) {
        bot.sendMessage(
            chatId,
            'Please provide URL of article!',
        );
        return;
    }

    tempSiteURL = url;
    bot.sendMessage(
        chatId,
        'URL has been successfully saved!',
        {
            reply_markup: {
                inline_keyboard: [[
                    {
                        text: 'Development',
                        callback_data: 'development'
                    }, {
                        text: 'Lifestyle',
                        callback_data: 'lifestyle'
                    }, {
                        text: 'Other',
                        callback_data: 'other'
                    }
                ]]
            }
        }
    );
});

// Listener (handler) for callback data from /label command
bot.on('callback_query', (callbackQuery) => {
    const message = callbackQuery.message;
    const category = callbackQuery.data;

    URLLabels.push({
        url: tempSiteURL,
        label: category,
    });

    tempSiteURL = '';

    bot.sendMessage(message.chat.id, `URL has been labeled with category "${category}"`);
});

// Listener (handler) for showcasing different keyboard layout
bot.onText(/\/keyboard/, (msg, match) => {
    bot.sendMessage(msg.chat.id, 'Alternative keybaord layout', {
        'reply_markup': {
            'keyboard': [['Sample text', 'Second sample'], ['Keyboard'], ['I\'m robot']]
        }
    });
});

// Listener (handler) for telegram's /start event
// This event happened when you start the conversation with both by the very first time
// Provide the list of available commands
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        `
            Welcome at <b>ArticleBot</b>, thank you for using my service
      
            Available commands:
        
            /bookmark <b>URL</b> - save interesting article URL
        `, {
            parse_mode: 'HTML',
        }
    );
});