import { Box, Flex, Heading } from "@chakra-ui/react";
import { ItemsSearchField } from "./ItemsSearchField";
import { NewItemsSectionContent } from "./NewItemsSectionContent";

export const NewItemsSection = () => {
  return (
    <Box width="100%">
      <Flex align="center" wrap="wrap">
        <Heading as={'h2'} flex="0 0 auto" marginRight="2" textAlign="left">
          Latest items
        </Heading>
        <Box flex="0 0 auto" marginLeft="auto" width="48">
          <ItemsSearchField />
        </Box>
      </Flex>
      <NewItemsSectionContent />
    </Box>
  );
}
