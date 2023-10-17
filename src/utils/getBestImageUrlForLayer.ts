export function getBestImageUrlForLayer(layer, { hiResMode = false } = {}) {
  if (hiResMode && layer.svgUrl) {
    return layer.svgUrl;
  }
  return layer.imageUrl;
}
