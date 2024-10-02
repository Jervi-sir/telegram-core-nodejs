import express from 'express';
import telegramGroupsRoutes from './routes/telegramGroupsRoutes';
// import './jobs/scheduleScrapingJob';  // Import the job scheduler
import scrapeRoutes from './routes/scrapeRoutes';  // Import the new scrape routes
import scrapeGroupMessages from './jobs/scrapeTelegramMessages';

const app = express();
app.use(express.json());

// Use the routes
app.use('/api', telegramGroupsRoutes);
app.use('/api', scrapeRoutes);  // Add the scrape routes

// Start the scraping process immediately when the server starts
(async () => {
  console.log('Starting scraping process...');
  await scrapeGroupMessages();  // Run the scraper on server startup
})();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
