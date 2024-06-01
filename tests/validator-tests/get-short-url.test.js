import request from 'supertest';
import app from '../../server.js'; // 導入 Express 應用程序
import {getShortUrlValidator} from '../../validators/url.js';

describe('Get Short URL Validator', () => {
    //Test case 1: id is required
    it('id is required', async () => {
        const response=await request(app)
            .get('/api/1.0/shortUrl/e135')
            .send();
            expect(response.status).toBe(200);
    });
});