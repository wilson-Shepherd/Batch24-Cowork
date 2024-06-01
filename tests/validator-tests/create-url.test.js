import request from 'supertest';
import urlRoutes from '../../routes/url-routes';
import {createUrlValidator} from '../../validators/create-url-validator';

describe('Create URL Validator', () => {
    // Test case 1: longUrl is required
    it('longUrl is required', async () => {
        const response = await request(urlRoutes)
            .post('/1.0/shortUrl')
            .send({ longUrl: '' });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('longUrl is required');
    });
});