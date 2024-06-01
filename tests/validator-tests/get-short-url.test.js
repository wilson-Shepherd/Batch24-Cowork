import request from 'supertest';
import urlRoutes from '../../routes/url.js';
import {createUrlValidator} from '../../validators/url.js';

describe('Get Short URL Validator', () => {
    //Test case 1: id is required
    it('id is required', async () => {
        const response=await request(urlRoutes)
            .get('/1.0/shortUrl/')
            .send();
        expect(response.status).toBe(400);
        expect(response.body.errors[0].msg).toBe('id is required');
    });
});