import { SquareItemCardProps } from "@/utils/types";
import { Box, Text, Stack, Skeleton } from "@chakra-ui/react";

export const CardLayout = ({
  name,
  thumbnailImage,
  footer,
  minHeightNumLines = 2,
  removeButton,
} : SquareItemCardProps) => {
  return (
    // SquareItemCard renders in large lists of 1k+ items
    // we should investigate if this is still a performance bottleneck
      <Stack
        boxShadow={'md'}
        padding={3}
      >
        {thumbnailImage ? thumbnailImage : <Skeleton width="80px" height="80px" />}
        <Box
          mt={1}
        >
          {name ? <Text fontSize={'sm'}
            noOfLines={minHeightNumLines}>{name}
            </Text> :  <Skeleton width="100%" height="1em"/>}
        </Box>
        {footer && (
          <Box>
            {footer}
          </Box>
        )}
      </Stack>
  );
}
