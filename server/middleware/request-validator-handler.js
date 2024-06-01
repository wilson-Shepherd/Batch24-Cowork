import { validationResult } from "express-validator";

const validateResult = (req, res, next) => {
    const requestData = req.params || req.body || req.query;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export default validateResult;