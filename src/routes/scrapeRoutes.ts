import { Router } from 'express';
import ScrapeController from '../controllers/ScrapeController';

const router = Router();

// Endpoint to trigger the scraping process
router.get('/scrape', ScrapeController.runScrape);

export default router;
