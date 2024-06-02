import pools from "../database/connDB.js";
import funcDB from "../database/funcDB.js";
const { newUrl, updateClicks, getAllUrl, getUrl, deleteUrl } = funcDB;

const Groups = [];
//base62 encoded url
async function dbPrefixSharding(long, short) {
  const head = short[0];
  const headGroups = getShardingGroups(pools.length); //group by heads
  for (let i = 0; i < headGroups.length; i++) {
    if (headGroups[i].includes(head)) {
      return insertWithLock(i, long, short);
    }
  }
  throw new Error(`${short} Error! Cannot find responding PrefixSharding DB!`);
}

async function insertWithLock(index, long, short) {
  //lock 耗時（用 unique key 可改善）
  const conn = await pools[index].getConnection();
  await conn.query(`LOCK TABLES urls READ;`);
  const result = await newUrl(conn, long, short);
  await conn.query(`UNLOCK TABLES;`);
  return result;
}

//一旦分好gorup 很難重新分配
//DB 增減的彈性不夠（進階考量：consistent hashing）
function getShardingGroups(num) {
  const letters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  if (Groups.length != 0) {
    return Groups;
  } else {
    const divide = Math.floor(letters.length / num);
    const mod = letters.length % num;
    for (let i = 0; i < num; i++) {
      if (i < mod) {
        const count = divide + 1;
        Groups.push(letters.slice(i * count, (i + 1) * count));
      } else {
        Groups.push(letters.slice(i * divide + mod, i * divide + mod + divide));
      }
    }
  }
  return Groups;
}
function checkPrefixDB(short) {
  const head = short[0];
  for (let i = 0; i < Groups.length; i++) {
    if (Groups[i].includes(head)) {
      return i;
    }
  }
  throw new Error(`${short} Error! Cannot find responding PrefixSharding DB!`);
}

export default { dbPrefixSharding, checkPrefixDB };
