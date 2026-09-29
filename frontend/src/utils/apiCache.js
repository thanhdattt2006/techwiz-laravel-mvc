/**
 * ApiCache Utility
 * Lightweight in-memory cache with TTL and in-flight promise deduplication.
 * Prevents redundant HTTP requests and eliminates queue lag on single-worker backends.
 */
class ApiCache {
  constructor(defaultTtlMs = 5 * 60 * 1000) {
    this.cache = new Map();
    this.inFlight = new Map();
    this.defaultTtl = defaultTtlMs;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  set(key, data, ttlMs = this.defaultTtl) {
    this.cache.set(key, { data, expiry: Date.now() + ttlMs });
  }

  invalidate(prefixOrKey = null) {
    if (!prefixOrKey) {
      this.cache.clear();
      return;
    }
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefixOrKey)) {
        this.cache.delete(key);
      }
    }
  }

  async fetch(key, fetchFn, ttlMs = this.defaultTtl) {
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    if (this.inFlight.has(key)) {
      return this.inFlight.get(key);
    }

    const promise = (async () => {
      try {
        const data = await fetchFn();
        this.set(key, data, ttlMs);
        return data;
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);
    return promise;
  }
}

export const globalApiCache = new ApiCache(5 * 60 * 1000);
