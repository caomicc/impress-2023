import { FetchOptions, Response } from '@/utils/types';
import { useEffect, useState } from 'react';


/**
 * useFetch uses `fetch` to fetch the given URL, and returns the request state.
 *
 * Our limited API is designed to match the `use-http` library!
 */
export function useFetch(
  url: string,
  { responseType, skip, ...fetchOptions }: FetchOptions,
): Response {
  // Just trying to be clear about what you'll get back ^_^` If we want to
  // fetch non-binary data later, extend this and get something else from res!
  if (responseType !== 'arrayBuffer') {
    throw new Error(`unsupported responseType ${responseType}`);
  }

  const [response, setResponse] = useState<Response>({
    loading: !skip,
    error: null,
    data: null,
  });

  // We expect this to be a simple object, so this helps us only re-send the
  // fetch when the options have actually changed, rather than e.g. a new copy
  // of an identical object!
  const fetchOptionsAsJson = JSON.stringify(fetchOptions);

  useEffect(() => {
    if (skip) {
      return;
    }

    let canceled = false;

    fetch(url, JSON.parse(fetchOptionsAsJson))
      .then(async (res) => {
        if (canceled) {
          return;
        }

        const arrayBuffer = await res.arrayBuffer();
        setResponse({ loading: false, error: null, data: arrayBuffer });
      })
      .catch((error) => {
        if (canceled) {
          return;
        }

        setResponse({ loading: false, error, data: null });
      });

    return () => {
      canceled = true;
    };
  }, [skip, url, fetchOptionsAsJson]);

  return response;
}
