import { useEffect, useState } from 'react';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import usePreferArchive from '@/hooks/usePreferArchive';
import { loadImage } from '@/utils/loadImage';
import { loadMovieLibrary } from '@/utils/loadMovieLibrary';

import { getBestImageUrlForLayer } from '../utils/getBestImageUrlForLayer';
import { CancelablePromise, Layer, MovieAssetPromise, ImageAssetPromise } from '@/utils/types';


const makeCancelable = <T>(promise: Promise<T>): CancelablePromise<T> => {
  let hasCanceled = false;

  const wrappedPromise: CancelablePromise<T> = new Promise(
    (resolve, reject) => {
      promise.then(
        (val) => (hasCanceled ? reject({ isCanceled: true }) : resolve(val)),
        (error) => (hasCanceled ? reject({ isCanceled: true }) : reject(error)),
      );
    },
  );

  wrappedPromise.cancel = () => {
    hasCanceled = true;
  };

  return wrappedPromise;
};

/**
 * usePreloadLayers preloads the images for the given layers, and yields them
 * when done. This enables us to keep the old outfit preview on screen until
 * all the new layers are ready, then show them all at once!
 */
export function usePreloadLayers(layers: Layer[]) {
  const [hiResMode] = useLocalStorage('DTIHiResMode', false);
  const [preferArchive] = usePreferArchive();

  const [error, setError] = useState<Error | null>(null);
  const [loadedLayers, setLoadedLayers] = useState<Layer[]>([]);
  const [layersHaveAnimations, setLayersHaveAnimations] = useState(false);

  // NOTE: This condition would need to change if we started loading one at a
  // time, or if the error case would need to show a partial state!
  const loading = layers.length > 0 && loadedLayers !== layers;

  useEffect(() => {
    // HACK: Don't clear the preview when we have zero layers, because it
    // usually means the parent is still loading data. I feel like this isn't
    // the right abstraction, though...
    if (layers.length === 0) {
      return;
    }

    let canceled = false;
    setError(null);
    setLayersHaveAnimations(false);

    const minimalAssetPromises: Promise<any>[] = [];
    const imageAssetPromises: Promise<any>[] = [];
    const movieAssetPromises: MovieAssetPromise[] = [];
    for (const layer of layers) {
      const imageAssetPromise = loadImage(
        getBestImageUrlForLayer(layer, { hiResMode }),
        { preferArchive },
      );
      imageAssetPromises.push(imageAssetPromise);

      if (layer.canvasMovieLibraryUrl) {
        // Start preloading the movie. But we won't block on it! The blocking
        // request will still be the image, which we'll show as a
        // placeholder, which should usually be noticeably faster!
        const movieLibraryPromise = loadMovieLibrary(
          layer.canvasMovieLibraryUrl,
          { preferArchive },
        );

        const movieAssetPromise: MovieAssetPromise = makeCancelable(
          movieLibraryPromise,
        ).then((library) => ({
          library,
          libraryUrl: layer.canvasMovieLibraryUrl,
        })) as MovieAssetPromise;

        movieAssetPromise.libraryUrl = layer.canvasMovieLibraryUrl;
        movieAssetPromise.cancel = () =>
          (movieLibraryPromise as MovieAssetPromise).cancel();
        movieAssetPromises.push(movieAssetPromise);

        // The minimal asset for the movie case is *either* the image *or*
        // the movie, because we can start rendering when either is ready.
        minimalAssetPromises.push(
          Promise.any([imageAssetPromise, movieAssetPromise]),
        );
      } else {
        minimalAssetPromises.push(imageAssetPromise);
      }
    }

    // When the minimal assets have loaded, we can say the layers have
    // loaded, and allow the UI to start showing them!
    Promise.all(minimalAssetPromises)
      .then(() => {
        if (canceled) return;
        setLoadedLayers(layers);
      })
      .catch((e) => {
        if (canceled) return;
        console.error('Error preloading outfit layers', e);
        setError(e);

        // Cancel any remaining promises, if cancelable.
        imageAssetPromises.forEach(
          (p: CancelablePromise<ImageAssetPromise>) => p.cancel && p.cancel(),
        );
        movieAssetPromises.forEach(
          (p: CancelablePromise<MovieAssetPromise>) => p.cancel && p.cancel(),
        );
      });

    // As the movie assets come in, check them for animations, to decide
    // whether to show the Play/Pause button.
    const checkHasAnimations = (asset: any) => {
      if (canceled) return;
      let assetHasAnimations: boolean;
      try {
        assetHasAnimations = getHasAnimationsForMovieAsset(asset);
      } catch (e: unknown) {
        console.error('Error testing layers for animations', e);
        setError(e as Error | null);
        return;
      }

      setLayersHaveAnimations(
        (alreadyHasAnimations) => alreadyHasAnimations || assetHasAnimations,
      );
    };
    movieAssetPromises.forEach((p) =>
      p.then(checkHasAnimations).catch((e) => {
        console.error(`Error preloading movie library ${p.libraryUrl}:`, e);
      }),
    );

    return () => {
      canceled = true;
    };
  }, [layers, hiResMode, preferArchive]);

  return { loading, error, loadedLayers, layersHaveAnimations };
}
