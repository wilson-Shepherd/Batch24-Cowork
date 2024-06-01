import request from 'supertest';
import app from '../../server.js'; // 導入 Express 應用程序
import {createUrlValidator} from '../../validators/url.js';

describe('Create URL Validator', () => {
    // Test case 1: longUrl is required
    it('longUrl is required', async () => {
        const response = await request(app)
            .post('/api/1.0/shortUrl')
            .send({ longUrl: '' });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('longUrl is required');
    });
    // Test case 2: longUrl must be a valid URL
    it('longUrl must be a valid URL', async () => {
        const response = await request(app)
            .post('/api/1.0/shortUrl')
            .send({ longUrl: 'invalid-url' });
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('longUrl must be a valid URL');
    });
});