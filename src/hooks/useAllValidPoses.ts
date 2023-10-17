import { useMemo, useEffect } from "react";
import { useFetch } from "./useFetch";

/**
 * useAllValidPoses fetches the valid pet poses, as a `valids` object ready to
 * pass into the various validity-checker utility functions!
 *
 * In addition to the network caching, we globally cache this response in the
 * client code as `cachedResponseForAllValidPetPoses`. This helps prevent extra
 * re-renders when client-side navigating between pages, similar to how cached
 * data from GraphQL serves on the first render, without a loading state.
 */
let cachedResponseForAllValidPetPoses: any = {
  loading: false,
  error: null,
  data: null,
};
export function useAllValidPetPoses() {
  const networkResponse = useFetch('/api/validPetPoses', {
    responseType: 'arrayBuffer',
    // If we already have globally-cached valids, skip the request.
    skip: cachedResponseForAllValidPetPoses != null,
  });

  // Use the globally-cached response if we have one, or await the network
  // response if not.
  const response = cachedResponseForAllValidPetPoses || networkResponse;
  const { loading, error, data: validsBuffer } = response;

  const valids = useMemo(
    () => validsBuffer && new DataView(validsBuffer),
    [validsBuffer],
  );

  // Once a network response comes in, save it as the globally-cached response.
  useEffect(() => {
    if (
      networkResponse &&
      !networkResponse.loading &&
      !cachedResponseForAllValidPetPoses
    ) {
      cachedResponseForAllValidPetPoses = networkResponse;
    }
  }, [networkResponse]);

  return { loading, error, valids };
}
