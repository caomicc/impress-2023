import { Box, BoxProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';
import {
  Children,
  cloneElement,
  startTransition,
  useCallback,
  useState,
} from 'react';

function FadeInOnLoad({ children, ...props }: PropsWithChildren<BoxProps>) {
  const [isLoaded, setIsLoaded] = useState(false);

  const onLoad = useCallback(() => {
    startTransition(() => {
      setIsLoaded(true);
    });
  }, []);

  const child = Children.only(children);
  const wrappedChild = cloneElement(<>{child}</>, { onLoad });

  return (
    <Box {...props} opacity={isLoaded ? 1 : 0}>
      {wrappedChild}
    </Box>
  );
}

export default FadeInOnLoad;
