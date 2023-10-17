import { useQuery } from '@apollo/client';
import { Box, Flex, Select, Text, useColorModeValue } from '@chakra-ui/react';
import gql from 'graphql-tag';

import { getClosestPose } from '@/utils/getClosestPose';
import { getValidPoses, pairIsValid } from '@/utils/getValidPoses';
import { SpeciesColorPickerProps, SpeciesColorSelectProps, ColorProps, SpeciesProps } from '@/utils/types';
import { useAllValidPetPoses } from '@/hooks/useAllValidPoses';
import React from 'react';

/**
 * SpeciesColorPicker lets the user pick the species/color of their pet.
 *
 * It preloads all species, colors, and valid species/color pairs; and then
 * ensures that the outfit is always in a valid state.
 *
 * NOTE: This component is memoized with React.memo. It's not the cheapest to
 *       re-render on every outfit change. This contributes to
 *       wearing/unwearing items being noticeably slower on lower-power
 *       devices.
 */

function SpeciesColorPicker({
  speciesId,
  colorId,
  idealPose,
  showPlaceholders = false,
  colorPlaceholderText = '',
  speciesPlaceholderText = '',
  stateMustAlwaysBeValid = false,
  isDisabled = false,
  speciesIsDisabled = false,
  size = 'md',
  speciesTestId = '',
  colorTestId = '',
  onChange,
}: SpeciesColorPickerProps) {
  const {
    loading: loadingMeta,
    error: errorMeta,
    data: meta,
  } = useQuery(gql`
    query SpeciesColorPicker {
      allSpecies {
        id
        name
        standardBodyId # Used for keeping items on during standard color changes
      }

      allColors {
        id
        name
        isStandard # Used for keeping items on during standard color changes
      }
    }
  `);

  const {
    loading: loadingValids,
    error: errorValids,
    valids,
  } = useAllValidPetPoses();

  const allColors = (meta && [...meta.allColors]) || [];
  allColors.sort((a: { name: string }, b: { name: any }) =>
    a.name.localeCompare(b.name),
  );
  const allSpecies = (meta && [...meta.allSpecies]) || [];
  allSpecies.sort((a: { name: string }, b: { name: any }) =>
    a.name.localeCompare(b.name),
  );

  const textColor = useColorModeValue('inherit', 'green.50');

  if ((loadingMeta || loadingValids) && !showPlaceholders) {
    return (
      <Text color={textColor} textShadow="md">
        Loading species/color data…
      </Text>
    );
  }

  if (errorMeta || errorValids) {
    return (
      <Text color={textColor} textShadow="md">
        Error loading species/color data.
      </Text>
    );
  }

  // When the color changes, check if the new pair is valid, and update the
  // outfit if so!
  const onChangeColor = (e: { target: { value: any } }) => {
    const newColorId = e.target.value;
    console.debug(`SpeciesColorPicker.onChangeColor`, {
      // for IMPRESS-2020-1H
      speciesId,
      colorId,
      newColorId,
    });

    // Ignore switching to the placeholder option. It shouldn't generally be
    // doable once real options exist, and it doesn't represent a valid or
    // meaningful transition in the case where it could happen.
    if (newColorId === 'SpeciesColorPicker-color-loading-placeholder') {
      return;
    }

    const species = allSpecies.find((s: SpeciesProps) => s.id === speciesId);
    const newColor = allColors.find((c: ColorProps) => c.id === newColorId);
    const validPoses = getValidPoses(valids, speciesId, newColorId);
    const isValid = validPoses.size > 0;
    if (stateMustAlwaysBeValid && !isValid) {
      // NOTE: This shouldn't happen, because we should hide invalid colors.
      // logAndCapture(
      //   new Error(
      //     `Assertion error in SpeciesColorPicker: Entered an invalid state, ` +
      //       `with prop stateMustAlwaysBeValid: speciesId=${speciesId}, ` +
      //       `colorId=${newColorId}.`
      //   )
      // );
      return;
    }
    const closestPose = getClosestPose(validPoses, idealPose);
    onChange(species, newColor, isValid, closestPose);
  };

  // When the species changes, check if the new pair is valid, and update the
  // outfit if so!
  const onChangeSpecies = (e: { target: { value: any } }) => {
    const newSpeciesId = e.target.value;
    console.debug(`SpeciesColorPicker.onChangeSpecies`, {
      // for IMPRESS-2020-1H
      speciesId,
      newSpeciesId,
      colorId,
    });

    // Ignore switching to the placeholder option. It shouldn't generally be
    // doable once real options exist, and it doesn't represent a valid or
    // meaningful transition in the case where it could happen.
    if (newSpeciesId === 'SpeciesColorPicker-species-loading-placeholder') {
      return;
    }

    const newSpecies = allSpecies.find(
      (s: SpeciesProps) => s.id === newSpeciesId,
    );
    if (!newSpecies) {
      // Trying to isolate Sentry issue IMPRESS-2020-1H, where an empty species
      // ends up coming out of `onChange`!
      console.debug({ allSpecies, loadingMeta, errorMeta, meta });
      // logAndCapture(
      //   new Error(
      //     `Assertion error in SpeciesColorPicker: species not found. ` +
      //       `speciesId=${speciesId}, newSpeciesId=${newSpeciesId}, ` +
      //       `colorId=${colorId}.`
      //   )
      // );
      return;
    }

    const color = allColors.find((c: ColorProps) => c.id === colorId);
    let validPoses = getValidPoses(valids, newSpeciesId, colorId);
    let isValid = validPoses.size > 0;

    if (stateMustAlwaysBeValid && !isValid) {
      // If `stateMustAlwaysBeValid`, but the user switches to a species that
      // doesn't support this color, that's okay and normal! We'll just switch
      // to one of the four basic colors instead.
      const basicColorId = [8, 34, 61, 84][Math.floor(Math.random() * 4)];
      const basicColor = allColors.find(
        (c: ColorProps) => c.id === basicColorId,
      );
      validPoses = getValidPoses(valids, newSpeciesId, basicColor?.id ?? '');
      isValid = true;
    }

    const closestPose = getClosestPose(validPoses, idealPose);

    onChange(newSpecies, color, isValid, closestPose);
  };

  // In `stateMustAlwaysBeValid` mode, we hide colors that are invalid on this
  // species, so the user can't switch. (We handle species differently: if you
  // switch to a new species and the color is invalid, we reset the color. We
  // think this matches users' mental hierarchy of species -> color: showing
  // supported colors for a species makes sense, but the other way around feels
  // confusing and restrictive.)
  //
  // Also, if a color is provided that wouldn't normally be visible, we still
  // show it. This can happen when someone models a new species/color combo for
  // the first time - the boxes will still be red as if it were invalid, but
  // this still smooths out the experience a lot.
  let visibleColors = allColors;
  if (stateMustAlwaysBeValid && valids && speciesId) {
    visibleColors = visibleColors.filter(
      (c: ColorProps) =>
        getValidPoses(valids, speciesId, c.id).size > 0 || c.id === colorId,
    );
  }

  return (
    <Flex direction="row">
      <SpeciesColorSelect
        aria-label="Pet color"
        value={colorId || 1}
        // We also wait for the valid pairs before enabling, so users can't
        // trigger change events we're not ready for. Also, if the caller
        // hasn't provided species and color yet, assume it's still loading.
        isLoading={
          allColors.length === 0 || loadingValids || !speciesId || !colorId
        }
        isDisabled={isDisabled}
        onChange={onChangeColor}
        size={size}
        valids={valids}
        speciesId={speciesId}
        colorId={colorId}
        data-test-id={colorTestId}
      >
        {
          // If the selected color isn't in the set we have here, show the
          // placeholder. (Can happen during loading, or if an invalid color ID
          // like null is intentionally provided while the real value loads.)
          !visibleColors.some((c: ColorProps) => c.id === colorId) && (
            <option value="SpeciesColorPicker-color-loading-placeholder">
              {colorPlaceholderText}
            </option>
          )
        }
        {
          // A long name for sizing! Should appear below the placeholder, out
          // of view.
          visibleColors.length === 0 && <option>Dimensional</option>
        }
        {visibleColors.map((color: ColorProps) => (
          <option key={color.id} value={color.id}>
            {color.name}
          </option>
        ))}
      </SpeciesColorSelect>
      <Box width={size === 'sm' ? 2 : 4} />
      <SpeciesColorSelect
        aria-label="Pet species"
        value={speciesId || 1}
        // We also wait for the valid pairs before enabling, so users can't
        // trigger change events we're not ready for. Also, if the caller
        // hasn't provided species and color yet, assume it's still loading.
        isLoading={
          allColors.length === 0 || loadingValids || !speciesId || !colorId
        }
        isDisabled={isDisabled || speciesIsDisabled}
        // Don't fade out in the speciesIsDisabled case; it's more like a
        // read-only state.
        onChange={onChangeSpecies}
        size={size}
        valids={valids}
        speciesId={speciesId}
        colorId={colorId}
        data-test-id={speciesTestId}
      >
        {
          // If the selected species isn't in the set we have here, show the
          // placeholder. (Can happen during loading, or if an invalid species
          // ID like null is intentionally provided while the real value
          // loads.)
          !allSpecies.some((s: SpeciesProps) => s.id === speciesId) && (
            <option value="SpeciesColorPicker-species-loading-placeholder">
              {speciesPlaceholderText}
            </option>
          )
        }
        {
          // A long name for sizing! Should appear below the placeholder, out
          // of view.
          allSpecies.length === 0 && <option>Tuskaninny</option>
        }
        {allSpecies.map((species: SpeciesProps) => (
          <option key={species.id} value={species.id}>
            {species.name}
          </option>
        ))}
      </SpeciesColorSelect>
    </Flex>
  );
}

const SpeciesColorSelect = ({
  size,
  valids,
  speciesId,
  colorId,
  isDisabled,
  isLoading,
  ...props
}: SpeciesColorSelectProps) => {
  const backgroundColor = useColorModeValue('white', 'gray.600');
  const borderColor = useColorModeValue('green.600', 'transparent');
  const textColor = useColorModeValue('inherit', 'green.50');

  const loadingProps = isLoading
    ? {
        // Visually the disabled state is the same as the normal state, but
        // with a wait cursor. We don't expect this to take long, and the flash
        // of content is rough!
        opacity: '1 !important',
        cursor: 'wait !important',
      }
    : {};

  return (
    <Select
      backgroundColor={backgroundColor}
      color={textColor}
      size={size}
      border="1px"
      borderColor={borderColor}
      boxShadow="md"
      width="auto"
      transition="all 0.25s"
      _hover={{
        borderColor: 'green.400',
      }}
      isInvalid={
        valids &&
        speciesId &&
        colorId &&
        !pairIsValid(valids, speciesId, colorId)
      }
      isDisabled={isDisabled || isLoading}
      errorBorderColor="red.300"
      _disabled={
        isDisabled ? { opacity: '1', cursor: 'not-allowed' } : undefined
      }
      {...props}
      {...loadingProps}
    />
  );
};


// fix this?
export default React.memo(SpeciesColorPicker);
