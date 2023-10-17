import { Box, InputGroup, InputLeftElement, Input, InputRightElement, IconButton } from "@chakra-ui/react";
import { SearchIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export const ItemsSearchField = () => {
  const [query, setQuery] = useState("");
  const { push: pushHistory } = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (query) {
          pushHistory(`/items/search/${encodeURIComponent(query)}`);
        }
      }}
    >
      <InputGroup size="sm">
        <InputLeftElement>
          <Link href="/items/search" passHref>
            <Box display="flex">
               <SearchIcon color="gray.400" />
            </Box>
          </Link>
        </InputLeftElement>
        <Input
          value={query}
          // backgroundColor={query ? 'white' : "transparent"}
          // _focus={{ backgroundColor: brightBackground }}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all items…"
          borderRadius="full"
        />
        <InputRightElement>
          <IconButton
            type="submit"
            variant="ghost"
            icon={<ArrowForwardIcon />}
            aria-label="Search"
            minWidth="1.5rem"
            minHeight="1.5rem"
            width="1.5rem"
            height="1.5rem"
            borderRadius="full"
            opacity={query ? 1 : 0}
            transition="opacity 0.2s"
            aria-hidden={query ? "false" : "true"}
          />
        </InputRightElement>
      </InputGroup>
    </form>
  );
}
