import { useOutfitPreview } from '@/hooks/useOutfitPreview';
import { OutfitPreviewProps } from '@/utils/types';

/**
 * OutfitPreview is for rendering a full outfit! It accepts outfit data,
 * fetches the appearance data for it, and preloads and renders the layers
 * together.
 *
 * If the species/color/pose fields are null and a `placeholder` node is
 * provided instead, we'll render the placeholder. And then, once those props
 * become non-null, we'll keep showing the placeholder below the loading
 * overlay until loading completes. (We use this on the homepage to show the
 * beach splash until outfit data arrives!)
 *
 * TODO: There's some duplicate work happening in useOutfitAppearance and
 * useOutfitState both getting appearance data on first load...
 */

function OutfitPreview(props: OutfitPreviewProps) {
  const { preview } = useOutfitPreview(props);
  return preview;
}

// // Polyfill Promise.any for older browsers: https://github.com/ungap/promise-any
// // NOTE: Normally I would've considered Promise.any within our support browser
// //       range… but it's affected 25 users in the past two months, which is
// //       surprisingly high. And the polyfill is small, so let's do it! (11/2021)
// Promise.any =
//   Promise.any ||
//   function ($) {
//     return new Promise(function (D, E, A, L) {
//       A = [];
//       L = $.map(function ($, i) {
//         return Promise.resolve($).then(D, function (O) {
//           return ((A[i] = O), --L) || E({ errors: A });
//         });
//       }).length;
//     });
//   };

export default OutfitPreview;
