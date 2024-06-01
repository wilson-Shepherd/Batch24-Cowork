import { urlModel } from '../models/url.js';

const createShortUrlController = async (req, res, next) => {
    try {
        let { longUrl, expiryDate } = req.body;

        //如果沒有指定 expiryDate，則設置過期時間為一個月後
        if (!expiryDate) {
            expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + 1);
        }
        //將longUrl轉換成短網址
        const shortUrl = Math.random().toString(36).substr(2, 8);

        //設定clickCount為0
        const clickCount = 0;

        //將longUrl、expiryDate存入資料庫
        const urlId = await urlModel.saveUrl(longUrl, shortUrl, clickCount, expiryDate);

        res.status(201).json({ id:urlId });
    } catch (error) {
        next(error);
    }
};

const getShortUrlControllerById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const url = await urlModel.getUrl(id);

        if (!url) {
            return res.status(404).json({ message: 'Short url not found' });
        }

        res.status(200).json(url);
    } catch (error) {
        next(error);
    }
};

export { createShortUrlController, getShortUrlControllerById };
