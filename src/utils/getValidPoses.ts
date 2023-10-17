export function getPairByte(
  valids: { getUint8: (arg0: number) => any },
  speciesId: number,
  colorId: number,
) {
  // Reading a bit table, owo!
  const speciesIndex = speciesId - 1;
  const colorIndex = colorId - 1;
  const numColors = valids.getUint8(1);
  const pairByteIndex = speciesIndex * numColors + colorIndex + 2;
  try {
    return valids.getUint8(pairByteIndex);
  } catch (e) {
    // logAndCapture(
    //   new Error(
    //     `Error loading valid poses for species=${speciesId}, color=${colorId}: ${e.message}`
    //   )
    // );
    return 0;
  }
}

export function pairIsValid(
  valids: { getUint8: (arg0: number) => any },
  speciesId: number,
  colorId: number,
) {
  return getPairByte(valids, speciesId, colorId) !== 0;
}

export function getValidPoses(
  valids: { getUint8: (arg0: number) => any },
  speciesId: number,
  colorId: number,
) {
  const pairByte = getPairByte(valids, speciesId, colorId);

  const validPoses = new Set();
  if (pairByte & 0b00000001) validPoses.add('HAPPY_MASC');
  if (pairByte & 0b00000010) validPoses.add('SAD_MASC');
  if (pairByte & 0b00000100) validPoses.add('SICK_MASC');
  if (pairByte & 0b00001000) validPoses.add('HAPPY_FEM');
  if (pairByte & 0b00010000) validPoses.add('SAD_FEM');
  if (pairByte & 0b00100000) validPoses.add('SICK_FEM');
  if (pairByte & 0b01000000) validPoses.add('UNCONVERTED');
  if (pairByte & 0b10000000) validPoses.add('UNKNOWN');

  return validPoses;
}
