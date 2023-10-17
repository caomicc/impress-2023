import { Center, Skeleton, HStack } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { CardLayout } from "./SquareItemCard/CardLayout";
import { SquareItemCard } from "./SquareItemCard/SquareItemCard";
import { ItemProps } from "@/utils/types";

export const NewItemsSectionContent = ()  => {
  const { loading, error, data } = useQuery(
    gql`
      query NewItemsSection {
        newestItems {
          id
          name
          thumbnailUrl
          isNc
          isPb
          speciesThatNeedModels {
            id
            name
          }
          babySpeciesThatNeedModels: speciesThatNeedModels(colorId: "6") {
            id
            name
          }
          maraquanSpeciesThatNeedModels: speciesThatNeedModels(colorId: "44") {
            id
            name
          }
          mutantSpeciesThatNeedModels: speciesThatNeedModels(colorId: "46") {
            id
            name
          }
          compatibleBodiesAndTheirZones {
            body {
              id
              representsAllBodies
              species {
                id
                name
              }
              canonicalAppearance {
                id
                color {
                  id
                  name
                  isStandard
                }
              }
            }
          }
        }
      }
    `
  );

  const { data: userData } = useQuery(
    gql`
      query NewItemsSection_UserData {
        newestItems {
          id
          currentUserOwnsThis
          currentUserWantsThis
        }
      }
    `,
    {
      context: { sendAuth: true },
      onError: (e) =>
        console.error("Error loading NewItemsSection_UserData, skipping:", e),
    }
  );

  if (loading) {
    const footer = (
      <Center fontSize="xs" height="1.5em">
        <Skeleton height="4px" width="100%" />
      </Center>
    );
    return (
      <HStack>
        <CardLayout footer={footer} name={undefined} thumbnailImage={undefined} id={0} boxShadow={undefined}/>
      </HStack>
    );
  }

  if (error) {
    return (
      <>
        Couldn't load new items. Check your connection and try again!
      </>
    );
  }

  // Merge in the results from the user data query, if available.
  const newestItems = data.newestItems.map((item : ItemProps) => {
    const itemUserData =
      (userData?.newestItems || []).find((i : ItemProps) => i.id === item.id) || {};
    return { ...item, ...itemUserData };
  });

  return (
    <HStack>
      {newestItems.map((item: ItemProps) => (
        <SquareItemCard
          key={item.id}
          item={item}
          footer={<ItemModelingSummary item={item} />}
          id={item.id} name={item.name} thumbnailImage={item.thumbnailUrl} boxShadow={'md'}        />
      ))}
    </HStack>
  );
}
