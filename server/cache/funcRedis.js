async function setRedis(client, key, value, expire = 0) {
  if (expire === 0) {
    return await client.set(client, key, JSON.stringify(value));
  } else {
    //expire unit : seconds
    return await client.set(key, JSON.stringify(value), "EX", expire);
  }
}
async function getRedis(client, key) {
  return JSON.parse(await client.get(key));
}

async function deleteRedis(client, key) {
  return await client.del(key);
}

async function saddRedis(client, set, value) {
  return await client.sadd(set, value);
}

async function spopRedis(client, set) {
  const member = await client.spop(set, 1);
  return member[0];
}

export default {
  setRedis,
  getRedis,
  deleteRedis,
  saddRedis,
  spopRedis
};
