import { Text, useColorModeValue, useToast } from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';

import { FullScreenCenter } from '@/components/FullScreenCenter';
import { OutfitLayers } from '@/components/OutfitLayers';
import { useLocalStorage } from '@/hooks/useLocalStorage';

import useOutfitAppearance from './useOutfitAppearance';
import { usePreloadLayers } from './usePreloadLayers';
import { OutfitPreviewProps } from '@/utils/types';

/**
 * useOutfitPreview is like `<OutfitPreview />`, but a bit more power!
 *
 * It takes the same props and returns a `preview` field, which is just like
 * `<OutfitPreview />` - but it also returns `appearance` data too, in case you
 * want to show some additional UI that uses the appearance data we loaded!
 */


export function useOutfitPreview({
  speciesId,
  colorId,
  pose,
  wornItemIds,
  appearanceId = null,
  isLoading = false,
  placeholder = null,
  loadingDelayMs,
  spinnerVariant,
  onChangeHasAnimations = null,
  ...props
}: OutfitPreviewProps) {
  const [isPaused, setIsPaused] = useLocalStorage('DTIOutfitIsPaused', true);
  const toast = useToast();

  const appearance = useOutfitAppearance({
    speciesId,
    colorId,
    pose,
    appearanceId,
    wornItemIds,
  });
  const { loading, error, visibleLayers } = appearance;

  const {
    loading: loading2,
    error: error2,
    loadedLayers,
    layersHaveAnimations,
  } = usePreloadLayers(visibleLayers);

  const onMovieError = useCallback(() => {
    if (!toast.isActive('outfit-preview-on-movie-error')) {
      toast({
        id: 'outfit-preview-on-movie-error',
        status: 'warning',
        title: "Oops, we couldn't load one of these animations.",
        description: "We'll show a static image version instead.",
        duration: null,
        isClosable: true,
      });
    }
  }, [toast]);

  const onLowFps = useCallback(
    (fps: any) => {
      setIsPaused(true);
      console.warn(`[OutfitPreview] Pausing due to low FPS: ${fps}`);

      if (!toast.isActive('outfit-preview-on-low-fps')) {
        toast({
          id: 'outfit-preview-on-low-fps',
          status: 'warning',
          title: 'Sorry, the animation was lagging, so we paused it! 😖',
          description:
            "We do this to help make sure your machine doesn't lag too much! " +
            'You can unpause the preview to try again.',
          duration: null,
          isClosable: true,
        });
      }
    },
    [setIsPaused, toast],
  );

  useEffect(() => {
    if (onChangeHasAnimations) {
      onChangeHasAnimations(layersHaveAnimations);
    }
  }, [layersHaveAnimations, onChangeHasAnimations]);

  const textColor = useColorModeValue('green.700', 'white');

  let preview;

  if (error || error2) {
    preview = (
      <FullScreenCenter>
        <Text color={textColor} p={3}>
          Could not load preview. Try again?
        </Text>
      </FullScreenCenter>
    );
  } else {
    preview = (
      <OutfitLayers
        loading={isLoading || loading || loading2}
        visibleLayers={loadedLayers}
        placeholder={placeholder}
        loadingDelayMs={loadingDelayMs}
        spinnerVariant={spinnerVariant}
        onMovieError={onMovieError}
        onLowFps={onLowFps}
        doTransitions
        isPaused={isPaused}
        {...props}
      />
    );
  }
  return { appearance, preview };
}
