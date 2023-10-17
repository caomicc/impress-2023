import { LRUCache } from "lru-cache";

// it to put *some* upper bound on memory growth.
export const HAS_ANIMATIONS_FOR_MOVIE_ASSET_CACHE =  new LRUCache<string, any>({
  max: 10,
});

export const MOVIE_LIBRARY_CACHE = new LRUCache<string, any>({
  max: 10,
});
