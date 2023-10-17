// theme/index.js
import { extendTheme } from '@chakra-ui/react';

// import { components } from './components';
// import { colors } from './foundations/colors';
// import { fonts } from './foundations/fonts';
// import { sizes } from './foundations/sizes';
// import { textStyles } from './foundations/textStyles';
// import { typography } from './foundations/typography';
// import { breakpoints } from './foundations/breakpoints';
import { styles } from './styles';

const overrides = {
  styles,
  // fonts,
  // colors,
  // textStyles,
  // breakpoints,
  // ...typography,
  // sizes,
  // // Other foundational style overrides go here
  // components,
};

export const theme = extendTheme(overrides);
