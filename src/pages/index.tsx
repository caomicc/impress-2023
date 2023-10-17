import { Box, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import OutfitPreview from '@/components/OutfitPreview';
import { StartOutfitForm } from '@/components/StartOutfitForm';
import Announcement from '@/components/WIPCallout';
import HomepageSplashImg from '@/images/homepage-splash.png';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import { AppConfig } from '@/utils/AppConfig';

const Index = () => {
  const [previewState, setPreviewState] = useState({
    speciesId: 1,
    colorId: 1,
    pose: 'HAPPY_MASC',
  });
  return (
    <Main
      meta={
        <Meta title={AppConfig.title} description={AppConfig.description} />
      }
    >
      <Flex direction="column" align="center" textAlign="center" marginTop="4">
        <Announcement>
          <Link href="https://impress.openneo.net/pardon-our-dust">
            Here's a little update on the state of DTI!
          </Link>
        </Announcement>
        <Box height="6" />
        <Box
          width="200px"
          height="200px"
          borderRadius="lg"
          boxShadow="md"
          overflow="hidden"
        >
          <OutfitPreview
            speciesId={previewState?.speciesId}
            colorId={previewState?.colorId}
            pose={previewState?.pose}
            wornItemIds={[]}
            loadingDelayMs={1500}
            placeholder={
              <Image
                src={HomepageSplashImg}
                width={200}
                height={200}
                alt=""
                layout="fixed"
              />
            }
          />
        </Box>
        <Box height="4" />
        <Text as="h1">Dress to Impress</Text>
        <Box
          fontSize="lg"
          fontStyle="italic"
          opacity="0.85"
          role="doc-subtitle"
        >
          Design and share your Neopets outfits!
        </Box>
        <Box height="8" />
        <StartOutfitForm onChange={setPreviewState} />
        <Box height="4" />
        <Box fontStyle="italic" fontSize="sm">
          or
        </Box>
        <Box height="4" />
        {/* <SubmitPetForm /> */}
        <Box height="16" />
        {/* <NewItemsSection /> */}
        <Box height="16" />
        {/* <FeedbackFormSection /> */}
        {/* <TestErrorSender /> */}
      </Flex>
    </Main>
  );
};

export default Index;
