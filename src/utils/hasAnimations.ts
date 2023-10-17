/**
 * Recursively scans the given MovieClip (or child createjs node), to see if
 * there are any animated areas.
 */
export function hasAnimations(createjsNode: any) {
  return (
    // Some nodes have simple animation frames.
    createjsNode.totalFrames > 1 ||
    // Tweens are a form of animation that can happen separately from frames.
    // They expect timer ticks to happen, and they change the scene accordingly.
    createjsNode.timeline?.tweens?.length >= 1 ||
    // And some nodes have _children_ that are animated.
    (createjsNode.children || []).some(hasAnimations)
  );
}
