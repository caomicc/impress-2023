export const styles = {
  global: {
    html: {
      // HACK: Chakra sets body as the relative position element, which is
      //       fine, except its `min-height: 100%` doesn't actually work
      //       unless paired with height on the root element too!
      height: '100%',
    },
    body: {
      background: 'gray.50',
      color: 'green.800',
      transition: 'all 0.25s',
    },
  },
};
