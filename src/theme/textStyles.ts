import { fonts } from './fonts';
import { typography } from './typography';

export const textStyles = {
  h1: {
    fontSize: {
      base: typography.fontSizes['3xl'],
      md: typography.fontSizes['4xl'],
      lg: typography.fontSizes['5xl'],
    },
    lineHeight: typography.lineHeights.shorter,
    fontWeight: typography.fontWeights.black,
    fontFamily: fonts.heading,
  },
  h2: {
    fontSize: {
      base: typography.fontSizes['2xl'],
      md: typography.fontSizes['3xl'],
      lg: typography.fontSizes['4xl'],
    },
    fontWeight: typography.fontWeights.semibold,
    lineHeight: typography.lineHeights.shorter,
    fontFamily: fonts.heading,
  },
  h3: {
    fontSize: {
      base: typography.fontSizes.xl,
      lg: typography.fontSizes['2xl'],
    },
    lineHeight: typography.lineHeights.shorter,
    fontWeight: typography.fontWeights.black,
    fontFamily: fonts.heading,
  },
  h4: {
    fontSize: {
      base: typography.fontSizes.md,
      lg: typography.fontSizes.lg,
    },
    lineHeight: typography.lineHeights.shorter,
    fontWeight: typography.fontWeights.black,
    fontFamily: fonts.heading,
  },
  h5: {
    fontSize: {
      base: typography.fontSizes.md,
      lg: typography.fontSizes.lg,
    },
    lineHeight: typography.lineHeights.shorter,
    fontWeight: typography.fontWeights.semibold,
    fontFamily: fonts.heading,
  },
  h6: {
    fontSize: {
      base: typography.fontSizes.sm,
      lg: typography.fontSizes.md,
    },
    lineHeight: typography.lineHeights.shorter,
    fontWeight: typography.fontWeights.black,
    letterSpacing: typography.letterSpacings.wider,
    fontFamily: fonts.heading,
    textTransform: 'uppercase',
  },
};
