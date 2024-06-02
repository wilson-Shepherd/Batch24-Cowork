import cache from "../cache/connRedis.js";
import redis from "../cache/funcRedis.js";
const { saddRedis, spopRedis } = redis;

import crypto from "crypto";
import { promisify } from "util";
const randomBytes = promisify(crypto.randomBytes);

const KEY_LENGTH = 7;
const KEY_QTY = 500000;
const CACHE_SET = "UNI_KEYS";
let insertCount = 0;

async function kgsCacheToDB(long) {
  const key = await getKey();
  if (key == undefined) throw new Error("Cache is running out of Unique keys");

  const index = getShardingGroups(pools.length);
  const conn = await pools[index].getConnection();
  return await newUrl(conn, long, index.toString() + short);
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
  return await saddRedis(cache[0], CACHE_SET, keys);
}
async function getKey() {
  return await spopRedis(cache[0], CACHE_SET);
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
