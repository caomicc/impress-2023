import { useLazyQuery } from "@apollo/client";
import { Box, useToast, Input, Button, HStack } from "@chakra-ui/react";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export const SubmitPetForm = () => {

  const { query, push: pushHistory } = useRouter();

  const toast = useToast();

  const [petName, setPetName] = useState<any>();

  const [loadPetQuery, { loading }] = useLazyQuery(
    gql`
      query SubmitPetForm($petName: String!) {
        petOnNeopetsDotCom(petName: $petName) {
          petAppearance {
            color {
              id
            }
            species {
              id
            }
            pose
          }
          wornItems {
            id
          }
        }
      }
    `,
    {
      fetchPolicy: "network-only",
      onCompleted: (data) => {
        if (!data) return;

        const { petAppearance, wornItems } = data.petOnNeopetsDotCom;
        if (petAppearance == null) {
          toast({
            title: "This pet exists, but is in a glitchy state on Neopets.com.",
            description:
              "Hopefully it gets fixed soon! If this doesn't sound right to you, contact us and let us know!",
            status: "error",
          });
          return;
        }

        const { species, color, pose } = petAppearance;
        const params = new URLSearchParams({
          name: petName,
          species: species.id,
          color: color.id,
          pose,
        });
        for (const item of wornItems) {
          params.append("objects[]", item.id);
        }
        pushHistory(`/outfits/new?${params}`);
      },
      onError: () => {
        toast({
          title: "We couldn't load that pet, sorry 😓",
          description: "Is it spelled correctly?",
          status: "error",
        });
      },
    }
  );

  const loadPet = useCallback(
    (petName: any) => {
      loadPetQuery({ variables: { petName } });
      // Start preloading the WardrobePage, too!
      // import("./WardrobePage").catch((e) => {
      //   // Let's just let this slide, because it's a preload error. Critical
      //   // failures will happen elsewhere, and trigger reloads!
      //   console.error(e);
      // });
    },
    [loadPetQuery]
  );

  // If the ?loadPet= query param is provided, auto-load the pet immediately.
  // This isn't used in-app, but is a helpful hook for things like link-ins and
  // custom search engines. (I feel like a route or a different UX would be
  // better, but I don't really know enough to commit to one… let's just keep
  // this simple for now, I think. We might change this someday!)
  const autoLoadPetName = query.loadPet;
  useEffect(() => {
    if (autoLoadPetName != null) {
      setPetName(autoLoadPetName);
      loadPet(autoLoadPetName);
    }
  }, [autoLoadPetName, loadPet]);

  // // const { brightBackground } = useCommonStyles();
  // const inputBorderColor = useColorModeValue("green.600", "green.500");
  // const inputBorderColorHover = useColorModeValue("green.400", "green.300");
  // const buttonBgColor = useColorModeValue("green.600", "green.300");
  // const buttonBgColorHover = useColorModeValue("green.700", "green.200");

  return (
    <Box>
        <Box
          as={'form'}
          onSubmit={(e) => {
            e.preventDefault();
            loadPet(petName);
          }}
        >
          <HStack spacing={4}>
            <Input
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              isDisabled={loading}
              placeholder="Enter a pet's name"
              aria-label="Enter a pet's name"
              boxShadow="md"
              width="14em"
            />
            <Button
              type="submit"
              colorScheme="green"
              isDisabled={!petName}
              isLoading={loading}
            >
              Start
            </Button>
          </HStack>
        </Box>
    </Box>
  );
}
