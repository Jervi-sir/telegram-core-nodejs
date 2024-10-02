import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import db from '../db/knex';
import { Api } from 'telegram';
import readline from "readline";
import { subHours, isBefore } from 'date-fns';  // Import date functions

// Telegram API credentials (replace with yours)
const apiId = 0;  // Your Telegram API ID
const apiHash = '';  // Your Telegram API Hash

async function scrapeGroupMessages() {
  try {
    // Fetch the session from the database
    const sessionRecord = await db('telegram_sessions').first();
    let session = sessionRecord ? sessionRecord.session : '';
    const stringSession = new StringSession(session);  // Use saved session or empty session
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
    const groups = await db('telegram_groups').where('is_confirmed', true).select('*');

    // Iterate through each group and scrape messages only if the last scrape was more than 6 hours ago
    for (const group of groups) {
      const now = new Date();
      const lastScraped = group.last_scraped ? new Date(group.last_scraped) : null;

      // If the group hasn't been scraped in the last 6 hours, scrape it
      if (!lastScraped || isBefore(lastScraped, subHours(now, 6))) {
        console.log(`Scraping group: ${group.group_link}`);

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

            // Upsert the message into the database
            await db('telegram_messages')
              .insert(messageData)
              .onConflict('message_link')
              .merge();

            console.log(`Processed message: ${messageData.message_link}`);
          }
        }

        // Update the last_scraped time to now
        await db('telegram_groups')
          .where('id', group.id)
          .update({ last_scraped: now });

        console.log(`Scraped group: ${group.group_link}`);
      } else {
        console.log(`Skipping group ${group.group_link}, scraped recently.`);
      }
    }
    console.log('Scraping completed successfully.');
  } catch (error) {
    console.error('Error scraping Telegram messages:', error);
  }
}

export default scrapeGroupMessages;
