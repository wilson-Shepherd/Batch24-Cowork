import clients from "../cache/connRedis.js";
import redis from "../cache/funcRedis.js";
const { setRedis, getRedis } = redis;
import pools from "../database/connDB.js";
import funcDB from "../database/funcDB.js";
const { getAllUrl } = funcDB;
import prefixSharding from "./dbPrefixSharding.js";
import rangeSharding from "./dbRangeSharding.js";
const { checkPrefixDB } = prefixSharding;
const { checkRangeDB } = rangeSharding;

async function getCacheURL(short) {
  const idxDB = 0;
  // const idxDB = checkPrefixDB(short);
  // const idxDB = checkRangeDB(short);
  const cache = await getRedis(clients[0], idxDB);
  if (cache) {
    console.log(`get DB-${idxDB} ${short} cache!`);
    return cache.find((obj) => obj.shorts === short);
  } else {
    const conn = await pools[idxDB].getConnection();
    const urls = await getAllUrl(conn);
    setRedis(clients[0], idxDB, urls, 24 * 60 * 60 * 3); //3 days
    console.log(`get DB-${idxDB} ${short} db!`);
    return urls.find((obj) => obj.shorts === short);
  }
}
async function cacheSetClicks(short, clicks) {
  const idxDB = 0;
  // const idxDB = checkPrefixDB(short);
  // const idxDB = checkRangeDB(short);
  const cache = await getRedis(clients[0], idxDB);
  const obj = cache.find((obj) => obj.shorts === short);
  obj.clicks = clicks;
  setRedis(clients[0], idxDB, urls, 24 * 60 * 60 * 3); //3days expire
  //when update to db?
}

export default { getCacheURL, cacheSetClicks };
