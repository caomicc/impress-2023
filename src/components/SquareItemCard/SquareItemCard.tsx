import { Box, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { CardLayout } from "./CardLayout";
import { RemoveButton } from "./RemoveButton";
import { ItemThumbnail } from "./ItemThumbnail";
import { SquareItemCardProps } from "@/utils/types";

export const SquareItemCard = ({
  id,
  name,
  thumbnailImage,
  currentUserWantsThis,
  currentUserOwnsThis,
  showRemoveButton = false,
  onRemove = () => {},
  tradeMatchingMode = "offering",
  footer = null,
  ...props
} : SquareItemCardProps) => {
  const tradeMatchOwnShadowColorValue = 'green.500';
  const tradeMatchWantShadowColorValue = 'blue.400';

  // When this is a trade match, give it an extra colorful shadow highlight so
  // it stands out! (They'll generally be sorted to the front anyway, but this
  // make it easier to scan a user's lists page, and to learn how the sorting
  // works!)
  let tradeMatchShadow;
  if (tradeMatchingMode === "offering" && currentUserWantsThis) {
    tradeMatchShadow = `0 0 6px ${tradeMatchWantShadowColorValue}`;
  } else if (tradeMatchingMode === "seeking" && currentUserOwnsThis) {
    tradeMatchShadow = `0 0 6px ${tradeMatchOwnShadowColorValue}`;
  } else {
    tradeMatchShadow = null;
  }

  return (
    <Flex
      role="group"
    >
      <Link href={`/items/${id}`} passHref>
        <Box
          as="a"
          borderRadius={'2xl'}
          _focus={
            tradeMatchShadow
              ? {
                  boxShadow: `${tradeMatchShadow}`,
                }
              : {
                  boxShadow: undefined,
                }
          }
          {...props}
        >
          <CardLayout
            id={id}
            name={name}
            thumbnailImage={
              <ItemThumbnail
                item={item}
                tradeMatchingMode={tradeMatchingMode}
                isActive={false}
                isDisabled={false}
                focusSelector={'[role=group]:focus-within &'}
                size="lg"
              />
            }
            removeButton={
              showRemoveButton ? (
                <RemoveButton onClick={onRemove} aria-label={"Remove"} />
              ) : null
            }
            boxShadow={tradeMatchShadow || 'green.200'}
            footer={footer}
            // item={item}
          />
        </Box>
      </Link>
      {showRemoveButton && (
        <Box
        pos={'absolute'}
        right={'0'}
        top={'0'}
        transform={'translate(50%, -50%)'}
        zIndex={'1'}
        padding={'0.75em'}
        opacity={'0'}
        sx={{
          '[role=group]:hover &, [role="group"]:focus-within &, &:hover, &:focus-within': {
              opacity: 1,
            }
        }}
        >
          <RemoveButton onClick={onRemove} aria-label={"Remove"} />
        </Box>
      )}
    </Flex>
  );
}
