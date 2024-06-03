// import { urlModel } from "../models/url.js";
import { generateShortURL } from "../utils/idGenerator.js";
import { generateRandomString } from "../utils/randomStringGenerator.js";
import { hashURL } from "../utils/hashGenerator.js";
import prefixSharding from "../controllers/dbPrefixSharding.js";
import rangeCharding from "../controllers/dbRangeSharding.js";
import kgsCache from "../controllers/kgsCache.js";
import pools from "../database/connDB.js";
import funcDB from "../database/funcDB.js";

const PAGESIZE = 6;
const conn = await pools[0].getConnection();

const createShortUrlController = async (req, res, next) => {
  try {
    let { longUrl, expiryDate } = req.body;

    //如果沒有指定 expiryDate，則設置過期時間為一個月後
    if (!expiryDate) {
      expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }
    //shortURL
    //方法一：亂碼
    // const shortUrl = Math.random().toString(36).substr(2, 7);
    //方法二：經過base62，用資料庫的 id (auto increment)，生成唯一的 shortURL
    // const shortUrl = generateShortURL();
    //方法三：經過base62，將隨機字串轉換
    // const shortUrl = generateRandomString(7).substring(0, 7);
    //方法四：經過base62，將隨機字串轉換

    //將longUrl、expiryDate存入資料庫 json-server for testing
    //const clickCount = 0;
    // const urlId = await urlModel.saveUrl(longUrl, shortUrl, clickCount, expiryDate);

    //Method-1  Base62 from longUrl
    // const shortUrl = hashURL(longUrl).substring(0, 7);
    // const urlId = await funcDB.newUrl(conn, longUrl, shortUrl);

    //Method-2 prefix data sharding => base62+db sharding
    const shortUrl = hashURL(longUrl).substring(0, 7);
    const urlId = await prefixSharding.dbPrefixSharding(longUrl, shortUrl);

    //Method-3 kgsCache
    // const urlId = await kgsCache.kgsCacheToDB(longUrl);

    //Method-4 range data sharding
    // const urlId = await rangeCharding.dbRangeSharding(longUrl);

    res.status(201).json({ id: urlId });
  } catch (error) {
    next(error);
  }
};

const getShortUrlController = async (req, res, next) => {
  try {
    const page = parseInt(req.query.paging, 10) || 0;
    const pageSize = PAGESIZE;
    // const { allUrls, nextPage } = await urlModel.getAllUrls(page, pageSize);
    const { allUrls, nextPage } = await funcDB.getUrl(conn, page, pageSize);

    res.status(200).json({ data: allUrls, next_page: nextPage });
  } catch (error) {
    next(error);
  }
};

const getShortUrlByIdController = async (req, res, next) => {
  try {
    console.log("HI");
    const { id } = req.params;
    // const urlData = await urlModel.getUrl(id);
    const urlData = await funcDB.getUrlById(conn, id);

    if (!urlData) {
      return res.status(404).json({ message: "Short url not found" });
    }

    res.status(200).json(urlData);
  } catch (error) {
    next(error);
  }
};

const redirectByShortUrlController = async (req, res, next) => {
  try {
    console.log(req.params);
    const { shortUrl } = req.params;
    // const urlData = await urlModel.updateClickCount(shortUrl);
    const update = await funcDB.updateClicks(conn, shortUrl, 1); //count 1 and update db (cache?)
    const urlData = await funcDB.getUrlByShort(conn, shortUrl);

    if (!urlData.longs) {
      return res.status(404).json({ message: "LongUrl not found" });
    }
    res.redirect(301, urlData.longs);
  } catch (error) {
    next(error);
  }
};

export {
  createShortUrlController,
  getShortUrlByIdController,
  getShortUrlController,
  redirectByShortUrlController
};
