const request = require('supertest');
const app = require('../../index');

afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500)); // Ensure server is closed properly
});

describe('GET /mean', () => {
    it('should calculate mean correctly', async () => {
        const response = await request(app)
            .get('/mean')
            .query({ nums: '1,2,3,4' });
        expect(response.status).toBe(200);
        expect(response.body.operation).toBe('mean');
        expect(response.body.value).toBe(2.5);
    });

    it('should handle NaN error', async () => {
        const response = await request(app)
            .get('/mean')
            .query({ nums: 'foo,2,3' });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('foo is not a number.');
    });

});

describe('GET /median', () => {
    it('should calculate median correctly for odd length', async () => {
        const response = await request(app)
            .get('/median')
            .query({ nums: '1,2,3,4,5' });
        expect(response.status).toBe(200);
        expect(response.body.operation).toBe('median');
        expect(response.body.value).toBe(3);
    });

});

describe('GET /mode', () => {
    it('should calculate mode correctly', async () => {
        const response = await request(app)
            .get('/mode')
            .query({ nums: '1,2,2,3,3,3,4' });
        expect(response.status).toBe(200);
        expect(response.body.operation).toBe('mode');
        expect(response.body.value).toBe(3);
    });

    it('should handle NaN error', async () => {
        const response = await request(app)
            .get('/mode')
            .query({ nums: 'foo,2,2,3,3,3,4' });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('foo is not a number.');
    });

});
