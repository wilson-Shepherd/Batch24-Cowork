import { Router } from "express";
import { createUrlValidator, getShortUrlValidator } from "../validators/url.js";
import validateResult from "../middleware/request-validator-handler.js";
import { createShortUrlController, getShortUrlControllerById } from "../controllers/url.js";

const router = Router();

router.post('/1.0/shortUrl', createUrlValidator, validateResult, createShortUrlController);

router.get('/1.0/shortUrl/:id', getShortUrlValidator, validateResult, getShortUrlControllerById);

export default router;