import { body } from 'express-validator';

export const createUrlValidator = [
    body('longUrl').notEmpty().withMessage('longUrl is required')
];
