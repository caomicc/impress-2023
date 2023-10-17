import { IMainProps } from '@/utils/types';
import { Box } from '@chakra-ui/react';

const Main = (props: IMainProps) => (
  <>
    {props.meta}
    <Box as="main">{props.children}</Box>
  </>
);

export { Main };
