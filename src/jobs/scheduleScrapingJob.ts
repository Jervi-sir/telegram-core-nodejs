import cron from 'node-cron';
import scrapeGroupMessages from './scrapeTelegramMessages';

// Schedule a job to run every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('Starting scraping job...');
  await scrapeGroupMessages();
  console.log('Scraping job completed.');
});
