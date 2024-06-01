import { Router } from "express";
import { createUrlValidator, getShortUrlsValidator, getShortUrlByIdValidator } from "../validators/url.js";
import validateResult from "../middleware/request-validator-handler.js";
import { createShortUrlController, getShortUrlController, getShortUrlByIdController } from "../controllers/url.js";

const router = Router();

router.post('/1.0/shortUrl', createUrlValidator, validateResult, createShortUrlController);

router.get('/1.0/shortUrl', getShortUrlsValidator, validateResult, getShortUrlController);

router.get('/1.0/shortUrl/:id', getShortUrlByIdValidator, validateResult, getShortUrlByIdController);

export default router;