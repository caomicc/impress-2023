import { Skeleton } from "@chakra-ui/react";
import { CardLayout } from "./CardLayout";
import { SquareItemCardProps } from "@/utils/types";

export const CardSkeleton = ({ minHeightNumLines, footer = null }:SquareItemCardProps) => {
  return (
    <CardLayout
      name={
        <>
          <Skeleton width="100%" height="1em" marginTop="2" />
          {minHeightNumLines >= 3 && (
            <Skeleton width="100%" height="1em" marginTop="2" />
          )}
        </>
      }
      thumbnailImage={<Skeleton width="80px" height="80px" />}
      minHeightNumLines={minHeightNumLines}
      footer={footer}
    />
  );
}
