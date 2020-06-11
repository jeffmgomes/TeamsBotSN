// Import dotenv
require('dotenv').config();

// Import express
const express = require('express');
const app = express();
const port = process.env.PORT||3000

// Import botbuilder
const { BotFrameworkAdapter, UserState, MemoryStorage } = require('botbuilder');
// Import my messaging extenstion
const { MessagingExtension } = require('./src/bots/messagingExtension');

// Create adapter
const adapter = new BotFrameworkAdapter({
    appId: process.env.BotID,
    appPassword: process.env.BotPassword
});

adapter.onTurnError = async (context, error) => {
    console.log(`Error: ${error}`);
    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );
};

// For local development, in-memory storage is used.
// CAUTION: The Memory Storage used here is for local bot debugging only. When the bot
// is restarted, anything stored in memory will be gone.
const memoryStorage = new MemoryStorage();
const userState = new UserState(memoryStorage);

// Create the Messaging Extension Bot
const bot = new MessagingExtension(userState);

//Create server
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

// Listen for incoming requests.
app.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await bot.run(context);
    });
});