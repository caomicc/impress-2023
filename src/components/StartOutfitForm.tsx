import { Box, Button, Flex, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

import SpeciesColorPicker from './SpeciesColorPicker';
import { SpeciesProps, StartOutfitFormProps, ColorProps } from '@/utils/types';


export function StartOutfitForm({
  onChange,
}: StartOutfitFormProps): JSX.Element {
  const { push: pushHistory } = useRouter();

  const idealPose = useMemo(
    () => (Math.random() > 0.5 ? 'HAPPY_FEM' : 'HAPPY_MASC'),
    [],
  );

  const [speciesId, setSpeciesId] = useState<number>(1);
  const [colorId, setColorId] = useState<number>(8);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [closestPose, setClosestPose] = useState<string>(idealPose);

  const onSubmit = (e: any) => {
    e.preventDefault();

    if (!isValid) {
      return;
    }

    const params = new URLSearchParams({
      species: speciesId.toString(),
      color: colorId.toString(),
      pose: closestPose,
    });

    pushHistory(`/outfits/new?${params}`);
  };

  const buttonBgColor = useColorModeValue('green.600', 'green.300');

  const buttonBgColorHover = useColorModeValue('green.700', 'green.200');

  return (
    <form onSubmit={onSubmit}>
      <Flex>
        <SpeciesColorPicker
          speciesId={speciesId}
          colorId={colorId}
          idealPose={idealPose}
          showPlaceholders
          colorPlaceholderText="Blue"
          speciesPlaceholderText="Acara"
          onChange={(
            species: SpeciesProps,
            color: ColorProps,
            isValid: boolean | ((prevState: boolean) => boolean),
            closestPose: string,
          ) => {
            setSpeciesId(species.id);
            setColorId(color.id);
            setIsValid(isValid);
            setClosestPose(closestPose);

            if (isValid) {
              onChange({
                speciesId: species.id,
                colorId: color.id,
                pose: closestPose,
              });
            }
          }}
        />
        <Box width="4" />
        <Button
          type="submit"
          colorScheme="green"
          disabled={!isValid}
          backgroundColor={buttonBgColor}
          _hover={{ backgroundColor: buttonBgColorHover }}
        >
          Start
        </Button>
      </Flex>
    </form>
  );
}
