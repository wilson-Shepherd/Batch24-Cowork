import { body, param } from 'express-validator';

export const createUrlValidator = [
    body('longUrl').notEmpty().withMessage('longUrl is required')
        .isURL().withMessage('longUrl must be a valid URL')
];

export const getShortUrlValidator = [
    param('id').notEmpty().withMessage('id is required')
];
