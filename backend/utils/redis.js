// FakeRedis.js (Node.js CommonJS version)
class FakeRedis {
  constructor() {
    this.store = new Map(); // key => { value, expiresAt (optional) }
    setInterval(() => this.cleanupExpiredKeys(), 60*1000);
  }

  set(key, value) {
    this.store.set(key, { value });
    return Promise.resolve('OK');
  }

  async get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  setex(key, ttlSeconds, value) {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, { value, expiresAt });
    return Promise.resolve('OK');
  }

  del(key) {
    this.store.delete(key);
    return Promise.resolve(1);
  }

  // Hash methods
  async hmset(key, obj) {
    let hash = await this.hgetall(key);
    if (!hash) hash = {};
    for (const k in obj) {
      hash[k] = obj[k];
    }
    this.store.set(key, { value: hash });
    return Promise.resolve('OK');
  }

  async hgetall(key) {
    const entry = this.store.get(key);
    // console.log(`[FakeRedis] hgetall called for key: ${key}`);
    if (!entry) {
      // console.log(`[FakeRedis] No entry found for key: ${key}`);
      return {};
    }
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      // console.log(`[FakeRedis] Entry expired for key: ${key}`);
      return {};
    }
    // console.log(`[FakeRedis] Entry for key: ${key}:`, entry.value);
    return entry.value || {};
  }

  async hset(key, field, value) {
    let hash = await this.hgetall(key);
    if (!hash) hash = {};
    hash[field] = value;
    this.store.set(key, { value: hash });
    return Promise.resolve(1);
  }

  async exists(key) {
    const entry = this.store.get(key);
    if (!entry) return 0;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return 0;
    }
    return 1;
  }

  cleanupExpiredKeys() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt && now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }
}

const redis = new FakeRedis();
module.exports = redis; 