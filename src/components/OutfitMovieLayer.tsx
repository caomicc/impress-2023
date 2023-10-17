import React, { ReactNode, useCallback, useLayoutEffect, useRef, useState } from "react";
import { LRUCache } from "lru-cache";
import { Box, Grid, useToast } from "@chakra-ui/react";

import usePreferArchive from "@/hooks/usePreferArchive";
import { loadImage } from "@/utils/loadImage";
import { safeImageUrl } from "@/utils/safeImageUrl";
import { loadMovieLibrary } from "@/utils/loadMovieLibrary";
import { buildMovieClip } from "@/utils/buildMovieClip";
import { OutfitMovieLayerProps } from "@/utils/types";

// Import EaselJS and TweenJS directly into the `window` object! The bundled
// scripts are built to attach themselves to `window.createjs`, and
// `window.createjs` is where the Neopets movie libraries expects to find them!
// NOTE: If there's no window (e.g. SSR), we skip this step.
if (typeof window !== "undefined") {
  require("imports-loader?wrapper=window!easeljs/lib/easeljs");
  require("imports-loader?wrapper=window!tweenjs/lib/tweenjs");
}



function OutfitMovieLayer({
  libraryUrl,
  width,
  height,
  placeholderImageUrl = null,
  isPaused = false,
  onLoad = () => null,
  onError = () => null,
  onLowFps = () => null,
  canvasProps = {},
}: ReactNode & OutfitMovieLayerProps) {
  const [preferArchive] = usePreferArchive();
  const [stage, setStage] = useState<any>();
  const [library, setLibrary] = useState(null);
  const [movieClip, setMovieClip] = useState(null);
  const [unusedHasCalledOnLoad, setHasCalledOnLoad] = useState(false);
  const [movieIsLoaded, setMovieIsLoaded] = useState(false);
  const canvasRef = useRef(null);
  const hasShownErrorMessageRef = useRef(false);
  const toast = useToast();

  // Set the canvas's internal dimensions to be higher, if the device has high
  // DPI like retina. But we'll keep the layout width/height as expected!
  const internalWidth = width * window.devicePixelRatio;
  const internalHeight = height * window.devicePixelRatio;

  const callOnLoadIfNotYetCalled = useCallback(() => {
    setHasCalledOnLoad((alreadyHasCalledOnLoad) => {
      if (!alreadyHasCalledOnLoad && onLoad) {
        onLoad();
      }
      return true;
    });
  }, [onLoad]);

  const updateStage = useCallback(() => {
    if (!stage) {
      return;
    }

    try {
      stage.update();
    } catch (e) {
      // If rendering the frame fails, log it and proceed. If it's an
      // animation, then maybe the next frame will work? Also alert the user,
      // just as an FYI. (This is pretty uncommon, so I'm not worried about
      // being noisy!)
      if (!hasShownErrorMessageRef.current) {
        console.error(`Error rendering movie clip ${libraryUrl}`);
        // logAndCapture(e);
        toast({
          status: "warning",
          title:
            "Hmm, we're maybe having trouble playing one of these animations.",
          description:
            "If it looks wrong, try pausing and playing, or reloading the " +
            "page. Sorry!",
          duration: 10000,
          isClosable: true,
        });
        // We do this via a ref, not state, because I want to guarantee that
        // future calls see the new value. With state, React's effects might
        // not happen in the right order for it to work!
        hasShownErrorMessageRef.current = true;
      }
    }
  }, [stage, toast, libraryUrl]);

  // This effect gives us a `stage` corresponding to the canvas element.
  useLayoutEffect(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

   const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    if (canvasRef.current?.getContext("2d") == null) {
      console.warn(`Out of memory, can't use canvas for ${libraryUrl}.`);
      toast({
        status: "warning",
        title: "Oops, too many animations!",
        description:
          `Your device is out of memory, so we can't show any more ` +
          `animations. Try removing some items, or using another device.`,
        duration: null,
        isClosable: true,
      });
      return;
    }

    setStage((stage: { canvas: HTMLCanvasElement; }) => {
      if (stage && stage.canvas === canvas) {
        return stage;
      }

      return new window.createjs.Stage(canvas);
    });

    return () => {
      setStage(undefined);

      if (canvas) {
        // There's a Safari bug where it doesn't reliably garbage-collect
        // canvas data. Clean it up ourselves, rather than leaking memory over
        // time! https://stackoverflow.com/a/52586606/107415
        // https://bugs.webkit.org/show_bug.cgi?id=195325
        canvas.width = 0;
        canvas.height = 0;
      }
    };
  }, [libraryUrl, toast]);

  // This effect gives us the `library` and `movieClip`, based on the incoming
  // `libraryUrl`.
  React.useEffect(() => {
    let canceled = false;

    const movieLibraryPromise = loadMovieLibrary(libraryUrl, { preferArchive });
    movieLibraryPromise
      .then((library) => {
        if (canceled) {
          return;
        }

        setLibrary(library);

        const movieClip = buildMovieClip(library, libraryUrl);
        setMovieClip(movieClip);
      })
  }, [libraryUrl, preferArchive]);
}

export default OutfitMovieLayer;
