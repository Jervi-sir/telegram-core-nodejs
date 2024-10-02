import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import db from '../db/knex';
import { Api } from 'telegram';
import readline from "readline";

// Telegram API credentials (replace with yours)
const apiId = 0;  // Your Telegram API ID
const apiHash = '';  // Your Telegram API Hash

async function scrapeGroupMessages() {
  try {
    // Fetch the session from the database
    const sessionRecord = await db('telegram_sessions').first();
    let session = sessionRecord ? sessionRecord.session : '';
    const stringSession = new StringSession(session);  // Use saved session or empty session
    console.log('entered the  : ', null);
    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // If there's no session, log in and save session
    if (!session) {
      console.log('No saved session. Logging in...');
      await client.start({
        phoneNumber: async () =>
          new Promise((resolve) =>
            rl.question("Please enter your number: ", resolve)
          ),
        password: async () =>
          new Promise((resolve) =>
            rl.question("Please enter your password: ", resolve)
          ),
        phoneCode: async () =>
          new Promise((resolve) =>
            rl.question("Please enter the code you received: ", resolve)
          ),
        onError: (err) => console.log(err),
      });

      // Save the session string to the database
      await db('telegram_sessions').insert({ session: client.session.save() });
      console.log('Session saved in database.');
    } else {
      console.log('Reusing saved session...');
      await client.connect();  // Reuse session without needing input
    }

    // Fetch all groups from the database
    const groups = await db('telegram_groups').select('*');

    // Iterate through each group and scrape messages
    for (const group of groups) {
      const messages = await client.getMessages(group.group_link, { limit: 100 });

      for (const message of messages) {
        if (message.media instanceof Api.MessageMediaPhoto && message.media.photo) {
          const messageData = {
            message: message.message || '',
            image_url: message.media.photo.id.toString(),
            group_id: group.id,
            message_link: `${group.group_link}/${message.id}`,
            sent_at: new Date(message.date * 1000),
            nb_views: message.views || 0,
            nb_likes: 0
          };
          // Perform an upsert: insert the message or update if the message_link already exists
          await db('telegram_messages')
            .insert(messageData)
            .onConflict('message_link')  // Specify the unique column for conflict
            .merge();  // Merge updates if conflict occurs
        }
      }
    }

    console.log('Scraping completed successfully.');
  } catch (error) {
    console.error('Error scraping Telegram messages:', error);
  }
}

export default scrapeGroupMessages;
