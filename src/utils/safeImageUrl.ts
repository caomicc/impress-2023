import { SafeImageOptions } from "./types";

/**
 * safeImageUrl returns an HTTPS-safe image URL for Neopets assets!
 */
export function safeImageUrl(
  urlString: string | Promise<string>,
  { crossOrigin = null, preferArchive = false }: SafeImageOptions = {},
): Promise<string> {
  if (urlString == null) {
    return urlString;
  }

  // can be a promise
  const urlToString = urlString.toString();

  let url;
  try {
    url = new URL(
      urlToString,
      // A few item thumbnail images incorrectly start with "/". When that
      // happens, the correct URL is at images.neopets.com.
      //
      // So, we provide "http://images.neopets.com" as the base URL when
      // parsing. Most URLs are absolute and will ignore it, but relative URLs
      // will resolve relative to that base.
      'http://images.neopets.com',
    );
  } catch (e) {
    // logAndCapture(
    //   new Error(
    //     `safeImageUrl could not parse URL: ${urlString}. Returning a placeholder.`
    //   )
    // );
    return Promise.resolve(
      'https://impress-2020.openneo.net/__error__URL-was-not-parseable__',
    );
  }

  // Rewrite Neopets URLs to their HTTPS equivalents, and additionally to our
  // proxy if we need CORS headers.
  if (
    url.origin === 'http://images.neopets.com' ||
    url.origin === 'https://images.neopets.com'
  ) {
    url.protocol = 'https:';
    if (preferArchive) {
      const archiveUrl = new URL(
        `/api/readFromArchive`,
        window.location.origin,
      );
      archiveUrl.search = new URLSearchParams({
        url: url.toString(),
      }).toString();
      url = archiveUrl;
    } else if (crossOrigin) {
      url.host = 'images.neopets-asset-proxy.openneo.net';
    }
  } else if (
    url.origin === 'http://pets.neopets.com' ||
    url.origin === 'https://pets.neopets.com'
  ) {
    url.protocol = 'https:';
    if (crossOrigin) {
      url.host = 'pets.neopets-asset-proxy.openneo.net';
    }
  }

  if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
    // logAndCapture(
    //   new Error(
    //     `safeImageUrl was provided an unsafe URL, but we don't know how to ` +
    //       `upgrade it to HTTPS: ${urlString}. Returning a placeholder.`
    //   )
    // );
    return Promise.resolve(
      'https://impress-2020.openneo.net/__error__URL-was-not-HTTPS__',
    );
  }
  return Promise.resolve(url.toString());
}
