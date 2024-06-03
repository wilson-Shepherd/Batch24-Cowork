import cache from "../cache/connRedis.js";
import redis from "../cache/funcRedis.js";
import pools from "../database/connDB.js";
import funcDB from "../database/funcDB.js";

import crypto from "crypto";
import { promisify } from "util";
const randomBytes = promisify(crypto.randomBytes);

const KEY_LENGTH = 7;
const KEY_QTY = 5000;
const CACHE_SET = "UNI_KEYS";
let insertCount = 0;

async function kgsCacheToDB(long) {
  const short = await getKey();
  if (short == undefined)
    throw new Error("Cache is running out of Unique keys");

  const index = getShardingGroups(pools.length);
  const conn = await pools[index].getConnection();
  return await funcDB.newUrl(conn, long, index.toString() + short);
}

async function getCryptoID() {
  const rawBytes = await randomBytes(KEY_LENGTH);
  return rawBytes.toString("hex");
}
async function setKeys() {
  const keys = [];
  for (let i = 0; i < KEY_QTY; i++) {
    keys.push(await getCryptoID());
  }
  return await redis.saddRedis(cache[0], CACHE_SET, keys);
}
async function getKey() {
  return await redis.spopRedis(cache[0], CACHE_SET);
}

function getShardingGroups(num) {
  const mod = insertCount % num;
  insertCount++;
  return mod;
}
function checkKgsDB(short) {
  return short[0];
}
setKeys();
export default { kgsCacheToDB, checkKgsDB };
