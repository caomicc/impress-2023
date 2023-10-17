import { Box, Container, Heading, Stack, Text } from '@chakra-ui/react';
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
import Header from '@/components/Header';

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
      <Header />
      <Container maxW={'4xl'}>
        <Stack direction="column" align="center" textAlign="center" marginTop={4} spacing={8}>
          <Announcement>
            <Link href="https://impress.openneo.net/pardon-our-dust">
              Here's a little update on the state of DTI!
            </Link>
          </Announcement>
          <Box
            width="200px"
            height="200px"
            borderRadius="lg"
            boxShadow="md"
            overflow="hidden"
            pos={'relative'}
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
          <Box>
            <Heading
            as="h1"
            fontSize="5xl"
            fontWeight={900}
            >
              Dress to Impress
            </Heading>
            <Text
              fontSize="lg"
              fontStyle="italic"
              opacity="0.85"
              role="doc-subtitle"
            >
              Design and share your Neopets outfits!
            </Text>
          </Box>
          <StartOutfitForm onChange={setPreviewState} />
          <Text fontStyle="italic" fontSize="sm">or</Text>
          {/* <SubmitPetForm /> */}
          {/* <NewItemsSection /> */}
          {/* <FeedbackFormSection /> */}
          {/* <TestErrorSender /> */}
        </Stack>
      </Container>
    </Main>
  );
};

export default Index;
