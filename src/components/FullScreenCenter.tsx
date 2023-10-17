import type { FlexProps } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export function FullScreenCenter({
  children,
  ...otherProps
}: PropsWithChildren<FlexProps>) {
  return (
    <Flex
      pos="absolute"
      top="0"
      right="0"
      bottom="0"
      left="0"
      alignItems="center"
      justifyContent="center"
      {...otherProps}
    >
      {children}
    </Flex>
  );
}
