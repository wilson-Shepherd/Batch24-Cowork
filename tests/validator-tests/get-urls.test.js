import request from 'supertest';
import app from '../../server.js'; // 導入 Express 應用程序

describe('Get URLs Validator', () => {
    //Test Case 1 : paging must be a non-negative integer.
    it('paging must be a non-negative integer', async ()=>{
        const response =await request(app)
        .get('/api/1.0/shortUrl')
        .query({ paging:-1 });
        expect(response.statusCode).toBe(400);
        expect(response.body.errors[0].msg).toBe('Paging must be a non-negative integer.');
    });

});