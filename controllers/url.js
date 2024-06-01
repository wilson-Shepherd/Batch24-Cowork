import { urlModel } from '../models/url.js';

const PAGESIZE = 6;

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

        res.status(201).json({ id: urlId });
    } catch (error) {
        next(error);
    }
};

const getShortUrlController = async (req, res, next) => {
    try {
        const page = parseInt(req.query.paging, 10) || 0;
        const pageSize = PAGESIZE;
        const { allUrls, nextPage } = await urlModel.getAllUrls(page, pageSize);
        res.status(200).json({ data: allUrls, next_page: nextPage });
    }catch (error) {
        next(error);
    }
};

const getShortUrlByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const urlData = await urlModel.getUrl(id);

        if (!urlData) {
            return res.status(404).json({ message: 'Short url not found' });
        }

        res.status(200).json(urlData);
    } catch (error) {
        next(error);
    }
};

export { createShortUrlController, getShortUrlByIdController, getShortUrlController };
