import type { NormalizedCacheObject } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import buildClient from '@/utils/apolloClient';

export function DTIApolloProvider({
  children,
  additionalCacheState,
}: {
  children: React.ReactNode;
  additionalCacheState: NormalizedCacheObject;
}) {
  const auth0 = useAuth0();
  const auth0Ref = useRef(auth0);

  useEffect(() => {
    auth0Ref.current = auth0;
  }, [auth0]);

  // Save the first `additionalCacheState` we get as our `initialCacheState`,
  // which we'll use to initialize the client without having to wait a tick.
  const [initialCacheState, unusedSetInitialCacheState] =
    useState(additionalCacheState);

  const client = useMemo(
    () =>
      buildClient({
        getAuth0: () => auth0Ref.current,
        initialCacheState,
      }),
    [initialCacheState],
  );

  // When we get a new `additionalCacheState` object, merge it into the cache:
  // copy the previous cache state, merge the new cache state's entries in,
  // and "restore" the new merged cache state.
  //
  // HACK: Using `useMemo` for this is a dastardly trick!! What we want is the
  //       semantics of `useEffect` kinda, but we need to ensure it happens
  //       *before* all the children below get rendered, so they don't fire off
  //       unnecessary network requests. Using `useMemo` but throwing away the
  //       result kinda does that. It's evil! It's nasty! It's... perfect?
  //       (This operation is safe to run multiple times too, in case memo
  //       re-runs it. It's just, y'know, a performance loss. Maybe it's
  //       actually kinda perfect lol)
  //
  //       I feel like there's probably a better way to do this... like, I want
  //       the semantic of replacing this client with an updated client - but I
  //       don't want to actually replace the client, because that'll break
  //       other kinds of state, like requests loading in the shared layout.
  //       Idk! I'll see how it goes!
  useMemo(() => {
    const previousCacheState = client.cache.extract();
    const mergedCacheState = { ...previousCacheState };
    for (const key of Object.keys(additionalCacheState)) {
      mergedCacheState[key] = {
        ...mergedCacheState[key],
        ...additionalCacheState[key],
      };
    }
    console.debug(
      'Merging Apollo cache:',
      additionalCacheState,
      mergedCacheState,
    );
    client.cache.restore(mergedCacheState);
  }, [client, additionalCacheState]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
