import { safeImageUrl } from './safeImageUrl';
import { LoadImageOptions } from './types';

export function loadImage(
  rawSrc: string,
  { crossOrigin = null, preferArchive = false }: LoadImageOptions = {},
): Promise<HTMLImageElement> {
  const src = safeImageUrl(rawSrc, { crossOrigin, preferArchive });
  const image = new Image();
  let canceled = false;
  let resolved = false;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => {
      if (canceled) return;
      resolved = true;
      resolve(image);
    };
    image.onerror = () => {
      if (canceled) return;
      reject(new Error(`Failed to load image: ${JSON.stringify(src)}`));
    };
    if (crossOrigin) {
      image.crossOrigin = crossOrigin;
    }
    (async () => {
      const imageSrc = await src;
      image.src = imageSrc;
    })();
  });

  const cancel = () => {
    // NOTE: To keep `cancel` a safe and unsurprising call, we don't cancel
    //       resolved images. That's because our approach to cancelation
    //       mutates the Image object we already returned, which could be
    //       surprising if the caller is using the Image and expected the
    //       `cancel` call to only cancel any in-flight network requests.
    //       (e.g. we cancel a DTI movie when it unloads from the page, but
    //       it might stick around in the movie cache, and we want those images
    //       to still work!)
    if (resolved) return;
    image.src = '';
    canceled = true;
  };
  (promise as any).cancel = cancel;

  return promise;
}
