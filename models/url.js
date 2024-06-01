import axios from "axios";

const baseUrl = 'http://localhost:3001/urls';

export const urlModel = {
    async saveUrl(longUrl, shortUrl, clickCount, expiryDate) {
        try {
            const response = await axios.post(baseUrl, {
                longUrl,
                shortUrl,
                clickCount,
                expiryDate
            });
            return response.data.id;
        } catch (error) {
            console.error('Error saving url:', error.errors.map(e => e.msg));
            throw new Error('Error saving url, please try again.');
        }
    },

    async getUrl(id) {
        try {
            const response = await axios.get(`${baseUrl}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error getting url:', error.errors.map(e => e.msg));
            throw new Error('Error getting url, please try again.');
        }
    }
};