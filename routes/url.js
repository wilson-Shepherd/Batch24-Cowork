import { Router } from "express";
import { validationResult } from "express-validator";
import { createUrlValidator } from "../validators/create-url-validator.js";

const router = Router();

router.post('/1.0/shortUrl',createUrlValidator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
});

export default router;