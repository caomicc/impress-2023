import { BoxProps } from "@chakra-ui/react";
import { PropsWithChildren, ReactNode } from "react";

declare global {
  interface Window {
    AdobeAn: {
      compositions: Record<string, any>;
    };
    createjs: any;
  }
}

export type PoseOrder = string[];

export interface ClosestPosesInOrderProps {
  [key: string]: PoseOrder;
  [key: number]: PoseOrder;
}

export interface PetAppearance {
  layers: {
    id: string;
    zone: {
      id: string;
      depth: number;
    };
  }[];
  restrictedZones: {
    id: string;
  }[];
  pose: string;
}

export interface LoadImageOptions {
  crossOrigin?: string | null;
  preferArchive?: boolean;
}


export interface CancelablePromise<T> extends Promise<T> {
  cancel: () => void;
}

export interface OutfitLayersProps {
  loading: boolean;
  visibleLayers: any[];
  placeholder?: React.ReactNode | null;
  loadingDelayMs?: number;
  spinnerVariant?: string;
  doTransitions?: boolean;
  isPaused?: boolean;
  onMovieError?: ((error: Error) => void) | undefined;
  onLowFps?: ((fps: number) => void) | undefined;
}

export interface LibraryItem {
  id: number;
  src: string;
  name?: string;
}

export interface OutfitMovieLayerProps {
  libraryUrl: string;
  width: number;
  height: number;
  placeholderImageUrl?: string | null;
  isPaused?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  onLowFps?: (fps: number) => void;
  canvasProps?: React.ComponentProps<"canvas">;
}

export interface Response {
  loading: boolean;
  error: Error | null;
  data: ArrayBuffer | null;
}

export interface FetchOptions extends RequestInit {
  responseType: 'arrayBuffer';
  skip?: boolean;
}

export interface OutfitState {
  speciesId: number;
  colorId: number;
  pose: string;
  appearanceId?: number | null;
  wornItemIds: number[];
}

export interface OutfitPreviewProps {
  speciesId: number;
  colorId: number;
  pose: string;
  wornItemIds: number[];
  appearanceId?: number | null;
  isLoading?: boolean;
  placeholder?: React.ReactNode | null;
  loadingDelayMs?: number;
  spinnerVariant?: string;
  onChangeHasAnimations?: ((hasAnimations: boolean) => void) | null;
  doTransitions?: boolean;
  isPaused?: boolean;
  onMovieError?: ((error: Error) => void) | null;
  onLowFps?: ((fps: number) => void) | null;
}

export interface CacheState {
  [key: string]: any;
}

export interface SafeImageOptions {
  crossOrigin?: string | null;
  preferArchive?: boolean;
}

export interface Layer {
  canvasMovieLibraryUrl?: string;
}

export interface MovieAssetPromise extends Promise<any> {
  libraryUrl: string;
  cancel: () => void;
}

export interface ImageAssetPromise extends Promise<any> {
  imageUrl: string;
}


export type ColorProps = {
  id: number;
  name: string;
};

export type SpeciesProps = {
  id: number;
  name: string;
};

export type PoseProps = {
  id: number;
  name: string;
};

export type SpeciesColorPickerProps = {
  speciesId: number;
  colorId: number;
  idealPose: string;
  showPlaceholders?: boolean;
  colorPlaceholderText?: string;
  speciesPlaceholderText?: string;
  stateMustAlwaysBeValid?: boolean;
  isDisabled?: boolean;
  speciesIsDisabled?: boolean;
  size?: string;
  speciesTestId?: string;
  colorTestId?: string;
  onChange: (
    species: SpeciesProps,
    color: ColorProps,
    isValid: boolean | ((prevState: boolean) => boolean),
    closestPose: string,
  ) => void;
};

export type SpeciesColorSelectProps = PropsWithChildren & {
  size: string;
  valids: any;
  speciesId: number;
  colorId: number;
  isDisabled: boolean;
  isLoading: boolean;
  value: number;
  onChange: (e: { target: { value: any } }) => void;
};

export type AnnouncementProps = PropsWithChildren<{
  details?: string;
  size?: 'sm' | 'md';
  placement?: 'top' | 'bottom';
}>;


export type ClientProps = {
  getAuth0: any;
  initialCacheState?: any;
};

export type StartOutfitFormProps = {
  onChange: (values: {
    speciesId: number;
    colorId: number;
    pose: string;
  }) => void;
};

export type IMainProps = BoxProps & {
  meta?: ReactNode;
  children: ReactNode;
};

export type IMetaProps = {
  title: string;
  description: string;
  canonical?: string;
};
