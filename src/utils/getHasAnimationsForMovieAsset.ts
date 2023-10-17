// This cache is large because it's only storing booleans; mostly just capping

import { hasAnimations } from "@/components/OutfitMovieLayer";
import { buildMovieClip } from "./buildMovieClip";
import { HAS_ANIMATIONS_FOR_MOVIE_ASSET_CACHE } from "./consts";


function getHasAnimationsForMovieAsset({ library, libraryUrl }) {
  // This operation can be pretty expensive! We store a cache to only do it
  // once per layer per session ish, instead of on each outfit change.
  const cachedHasAnimations =
    HAS_ANIMATIONS_FOR_MOVIE_ASSET_CACHE.get(libraryUrl);
  if (cachedHasAnimations) {
    return cachedHasAnimations;
  }

  const movieClip = buildMovieClip(library, libraryUrl);

  // Some movie clips require you to tick to the first frame of the movie
  // before the children mount onto the stage. If we detect animations
  // without doing this, we'll incorrectly say no, because we see no children!
  // Example: http://images.neopets.com/cp/items/data/000/000/235/235877_6d273e217c/235877.js
  movieClip.advance();

  const movieClipHasAnimations = hasAnimations(movieClip);

  HAS_ANIMATIONS_FOR_MOVIE_ASSET_CACHE.set(libraryUrl, movieClipHasAnimations);
  return movieClipHasAnimations;
}
