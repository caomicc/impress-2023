
import localFont from 'next/font/local';

const delicious = localFont({
  src: [
    {
      path: '../fonts/Delicious-Heavy.otf',
      weight: '800 1000',
      style: 'normal',
    },
    {
      path: '../fonts/Delicious-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/Delicious-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../fonts/Delicious-Italic.otf',
      weight: 'normal',
      style: 'italic',
    },
    {
      path: '../fonts/Delicious-Roman.otf',
      weight: 'normal',
      style: 'normal',
    },
  ],
});

export const fonts = {
  heading: delicious.style.fontFamily,
  // body: delicious.style.fontFamily,
  // accent: delicious.style.fontFamily,
};
