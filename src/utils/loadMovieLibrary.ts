import { loadImage } from './loadImage';
import { loadScriptTag } from './loadScriptTag';
import { safeImageUrl } from './safeImageUrl';
import { CancelablePromise } from './types';
import { MOVIE_LIBRARY_CACHE } from './consts';




export function loadMovieLibrary(
  librarySrc: string,
  { preferArchive = false } = {},
) {
  const cancelableResourcePromises: unknown[] = [];
  const cancelAllResources = () =>
    cancelableResourcePromises.forEach((p: unknown) =>
      (p as CancelablePromise<unknown>).cancel(),
    );

  // Most of the logic for `loadMovieLibrary` is inside this async function.
  // But we want to attach more fields to the promise before returning it; so
  // we declare this async function separately, then call it, then edit the
  // returned promise!
  const createMovieLibraryPromise = async () => {
    // First, check the LRU cache. This will enable us to quickly return movie
    // libraries, without re-loading and re-parsing and re-executing.
    const cachedLibrary = MOVIE_LIBRARY_CACHE.get(librarySrc);
    if (cachedLibrary) {
      return cachedLibrary;
    }

    // Then, load the script tag. (Make sure we set it up to be cancelable!)
    const scriptPromise = loadScriptTag(
      await safeImageUrl(librarySrc, { preferArchive }),
    );
    cancelableResourcePromises.push(scriptPromise);
    await scriptPromise;

    // These library JS files are interesting in their operation. It seems like
    // the idea is, it pushes an object to a global array, and you need to snap
    // it up and see it at the end of the array! And I don't really see a way to
    // like, get by a name or ID that we know by this point. So, here we go, just
    // try to grab it once it arrives!
    //
    // I'm not _sure_ this method is reliable, but it seems to be stable so far
    // in Firefox for me. The things I think I'm observing are:
    //   - Script execution order should match insert order,
    //   - Onload execution order should match insert order,
    //   - BUT, script executions might be batched before onloads.
    //   - So, each script grabs the _first_ composition from the list, and
    //     deletes it after grabbing. That way, it serves as a FIFO queue!
    // I'm not suuure this is happening as I'm expecting, vs I'm just not seeing
    // the race anymore? But fingers crossed!
    const compositions = window.AdobeAn?.compositions || {};
    if (Object.keys(compositions).length === 0) {
      throw new Error(
        `Movie library ${librarySrc} did not add a composition to window.AdobeAn.compositions.`,
      );
    }
    const [compositionId, composition] = Object.entries(compositions)[0]!;
    if (Object.keys(compositions).length > 1) {
      console.warn(
        `Grabbing composition ${compositionId}, but there are >1 here: `,
        Object.keys(compositions).length,
      );
    }
    delete compositions[compositionId];
    const library = composition.getLibrary();

    // One more loading step as part of loading this library is loading the
    // images it uses for sprites.
    //
    // TODO: I guess the manifest has these too, so if we could use our DB cache
    //       to get the manifest to us faster, then we could avoid a network RTT
    //       on the critical path by preloading these images before the JS file
    //       even gets to us?
    const librarySrcDir = librarySrc.split('/').slice(0, -1).join('/');
    const manifestImages = new Map(
      library.properties.manifest.map(
        ({ id, src }: { id: string; src: string }) => [
          id,
          loadImage(`${librarySrcDir}/${src}`, {
            crossOrigin: 'anonymous',
            preferArchive,
          }),
        ],
      ),
    );

    // Wait for the images, and make sure they're cancelable while we do.
    const manifestImagePromises = manifestImages.values();
    cancelableResourcePromises.push(...manifestImagePromises);

    await Promise.all(manifestImagePromises);

    // Finally, once we have the images loaded, the library object expects us to
    // mutate it (!) to give it the actual image and sprite sheet objects from
    // the loaded images. That's how the MovieClip's internal JS objects will
    // access the loaded data!
    const images = composition.getImages();
    for (const [id, image] of manifestImages.entries()) {
      images.set(id, await image);
    }
    const spriteSheets = composition.getSpriteSheet();
    for (const { name, frames } of library.ssMetadata) {
      const image = (await manifestImages.get(name)) as HTMLImageElement;
      spriteSheets[name] = new (window as any).createjs.SpriteSheet({
        images: [image],
        frames,
      });
    }

    MOVIE_LIBRARY_CACHE.set(librarySrc, library);

    return library;
  };

  const movieLibraryPromise = createMovieLibraryPromise().catch((e) => {
    // When any part of the movie library fails, we also cancel the other
    // resources ourselves, to avoid stray throws for resources that fail after
    // the parent catches the initial failure. We re-throw the initial failure
    // for the parent to handle, though!
    cancelAllResources();
    throw e;
  }) as CancelablePromise<any>;

  // To cancel a `loadMovieLibrary`, cancel all of the resource promises we
  // load as part of it. That should effectively halt the async function above
  // (anything not yet loaded will stop loading), and ensure that stray
  // failures don't trigger uncaught promise rejection warnings.
  movieLibraryPromise.cancel = cancelAllResources;

  return movieLibraryPromise;
}
