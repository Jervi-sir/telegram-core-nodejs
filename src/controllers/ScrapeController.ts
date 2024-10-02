import { Request, Response } from 'express';
import scrapeGroupMessages from '../jobs/scrapeTelegramMessages';

class ScrapeController {
  // Controller to trigger scraping manually via API
  async runScrape(req: Request, res: Response): Promise<void> {
    try {
      // Trigger the scraping process
      await scrapeGroupMessages();
      res.status(200).json({ message: 'Scraping completed successfully' });
    } catch (error) {
      console.error('Error in scraping process:', error);
      res.status(500).json({ message: 'Scraping failed', error: error.message });
    }
  }
}

export default new ScrapeController();
