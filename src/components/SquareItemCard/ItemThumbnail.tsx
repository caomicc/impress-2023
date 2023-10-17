import usePreferArchive from "@/hooks/usePreferArchive";
import { safeImageUrl } from "@/utils/safeImageUrl";
import { ItemThumbnailProps } from "@/utils/types";
import { Box } from "@chakra-ui/react";
import { ClassNames } from "@emotion/react";

/**
 * ItemThumbnail shows a small preview image for the item, including some
 * hover/focus and worn/unworn states.
 */
export function ItemThumbnail({
  item,
  size = "md",
  isActive,
  isDisabled,
  focusSelector,
  ...props
}: ItemThumbnailProps) {
  const [preferArchive] = usePreferArchive();

  const borderColor = 'green.700';

  const focusBorderColor = 'green.500';

  const thumbnailUrl = safeImageUrl(item.thumbnailUrl, { preferArchive });

  return (
    <ClassNames>
      {({ css }) => (
        <Box
          width={size === "lg" ? "80px" : "50px"}
          height={size === "lg" ? "80px" : "50px"}
          transition="all 0.15s"
          transformOrigin="center"
          position="relative"
          className={css([
            {
              transform: "scale(0.8)",
            },
            !isDisabled &&
              !isActive && {
                [focusSelector]: {
                  opacity: "0.9",
                  transform: "scale(0.9)",
                },
              },
            !isDisabled &&
              isActive && {
                opacity: 1,
                transform: "none",
              },
          ])}
          {...props}
        >
          <Box
            borderRadius="lg"
            boxShadow="md"
            border="1px"
            overflow="hidden"
            width="100%"
            height="100%"
            className={css([
              {
                borderColor: `${borderColor} !important`,
              },
              !isDisabled &&
                !isActive && {
                  [focusSelector]: {
                    borderColor: `${focusBorderColor} !important`,
                  },
                },
            ])}
          >
            {/* If the item is still loading, wait with an empty box. */}
            {item && (
              <Box
                as="img"
                width="100%"
                height="100%"
                src={thumbnailUrl as unknown as string}
                alt={`Thumbnail art for ${item.name}`}
              />
            )}
          </Box>
        </Box>
      )}
    </ClassNames>
  );
}
