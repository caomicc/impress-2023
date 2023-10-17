import { Box, DarkMode } from '@chakra-ui/react';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import usePreferArchive from '@/hooks/usePreferArchive';
import { getBestImageUrlForLayer } from '@/utils/getBestImageUrlForLayer';

import FadeInOnLoad from './FadeInOnLoad';
import { FullScreenCenter } from './FullScreenCenter';
import HangerSpinner from './HangerSpinner';
import { safeImageUrl } from '@/utils/safeImageUrl';
import Image from 'next/image';
import OutfitMovieLayer from './OutfitMovieLayer';
import { OutfitLayersProps } from '@/utils/types';


/**
 * OutfitLayers is the raw UI component for rendering outfit layers. It's
 * used both in the main outfit preview, and in other minor UIs!
 */
export function OutfitLayers({
  loading,
  visibleLayers,
  placeholder = null,
  loadingDelayMs = 500,
  spinnerVariant = 'overlay',
  doTransitions = false,
  isPaused = true,
  onMovieError = undefined,
  onLowFps = undefined,
  ...props
}: OutfitLayersProps) {
  const [hiResMode] = useLocalStorage('DTIHiResMode', false);
  const [preferArchive] = usePreferArchive();

  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState(0);
  const [loadingDelayHasPassed, setLoadingDelayHasPassed] =
    useState(false);

  // When we start in a loading state, or re-enter a loading state, start the
  // loading delay timer.
  useEffect(() => {
    if (loading) {
      setLoadingDelayHasPassed(false);
      const t = setTimeout(
        () => setLoadingDelayHasPassed(true),
        loadingDelayMs,
      );
      return () => clearTimeout(t);
    }
    return;
  }, [loadingDelayMs, loading]);

  // useLayoutEffect(() => {
  //   function computeAndSaveCanvasSize() {
  //     if (containerRef.current) {
  //       setCanvasSize(
  //         // Follow an algorithm similar to the <img> sizing: a square that
  //         // covers the available space, without exceeding the natural image size
  //         // (which is 600px).
  //         //
  //         // TODO: Once we're entirely off PNGs, we could drop the 600
  //         //       requirement, and let SVGs and movies scale up as far as they
  //         //       want...
  //         Math.min(
  //           containerRef.current.offsetWidth,
  //           containerRef.current.offsetHeight,
  //           600,
  //         ),
  //       );
  //     }
  //   }

  //   computeAndSaveCanvasSize();
  //   window.addEventListener('resize', computeAndSaveCanvasSize);
  //   return () => window.removeEventListener('resize', computeAndSaveCanvasSize);
  // }, [setCanvasSize]);

  return (
    <Box
      pos="relative"
      height="100%"
      width="100%"
      maxWidth="600px"
      maxHeight="600px"
      // Create a stacking context, so the z-indexed layers don't escape!
      zIndex="0"
      ref={containerRef}
      data-loading={loading ? true : undefined}
      {...props}
    >
      {placeholder && (
        <FullScreenCenter>
          <Box
            // We show the placeholder until there are visible layers, at which
            // point we fade it out.
            opacity={visibleLayers.length === 0 ? 1 : 0}
            transition="opacity 0.2s"
            width="100%"
            height="100%"
            maxWidth="600px"
            maxHeight="600px"
          >
            {placeholder}
          </Box>
        </FullScreenCenter>
      )}
      {visibleLayers.map(
        (layer: {
          id: React.Key | null | undefined;
          zone: { depth: any };
          canvasMovieLibraryUrl: any;
        }) => (
          <FadeInOnLoad
            key={layer.id}
            as={FullScreenCenter}
            zIndex={layer.zone.depth}
            opacity={0}
            transition=""
          >
            {layer.canvasMovieLibraryUrl ? (
              <>
                {/* <OutfitMovieLayer
                  libraryUrl={layer.canvasMovieLibraryUrl}
                  placeholderImageUrl={getBestImageUrlForLayer(layer, {
                    hiResMode,
                  })}
                  width={canvasSize}
                  height={canvasSize}
                  isPaused={isPaused}
                  onError={onMovieError}
                  onLowFps={onLowFps}
                /> */}
              </>
            ) : (
              <Image
                src={safeImageUrl(
                  getBestImageUrlForLayer(layer, { hiResMode }),
                  { preferArchive },
                ).toString()}
                alt=""
                fill={true}
              />
            )}
          </FadeInOnLoad>
        ),
      )}
      <FullScreenCenter
        zIndex="9000"
        // This is similar to our Delay util component, but Delay disappears
        // immediately on load, whereas we want this to fade out smoothly. We
        // also use a timeout to delay the fade-in by 0.5s, but don't delay the
        // fade-out at all. (The timeout was an awkward choice, it was hard to
        // find a good CSS way to specify this delay well!)
        opacity={loading && loadingDelayHasPassed ? 1 : 0}
        transition="opacity 0.2s"
      >
        {spinnerVariant === 'overlay' && (
          <>
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              backgroundColor="gray.900"
              opacity="0.7"
            />
            {/* Against the dark overlay, use the Dark Mode spinner. */}
            <DarkMode>
              <HangerSpinner />
            </DarkMode>
          </>
        )}
        {spinnerVariant === 'corner' && (
          <HangerSpinner
            size="sm"
            position="absolute"
            bottom="2"
            right="2"
          />
        )}
      </FullScreenCenter>
    </Box>
  );
}
