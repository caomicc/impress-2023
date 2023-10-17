import { ClosestPosesInOrderProps } from "./types";

const closestPosesInOrder: ClosestPosesInOrderProps = {
  HAPPY_MASC: [
    'HAPPY_MASC',
    'HAPPY_FEM',
    'SAD_MASC',
    'SAD_FEM',
    'SICK_MASC',
    'SICK_FEM',
    'UNCONVERTED',
    'UNKNOWN',
  ],
  HAPPY_FEM: [
    'HAPPY_FEM',
    'HAPPY_MASC',
    'SAD_FEM',
    'SAD_MASC',
    'SICK_FEM',
    'SICK_MASC',
    'UNCONVERTED',
    'UNKNOWN',
  ],
  SAD_MASC: [
    'SAD_MASC',
    'SAD_FEM',
    'HAPPY_MASC',
    'HAPPY_FEM',
    'SICK_MASC',
    'SICK_FEM',
    'UNCONVERTED',
    'UNKNOWN',
  ],
  SAD_FEM: [
    'SAD_FEM',
    'SAD_MASC',
    'HAPPY_FEM',
    'HAPPY_MASC',
    'SICK_FEM',
    'SICK_MASC',
    'UNCONVERTED',
    'UNKNOWN',
  ],
  SICK_MASC: [
    'SICK_MASC',
    'SICK_FEM',
    'SAD_MASC',
    'SAD_FEM',
    'HAPPY_MASC',
    'HAPPY_FEM',
    'UNCONVERTED',
    'UNKNOWN',
  ],
  SICK_FEM: [
    'SICK_FEM',
    'SICK_MASC',
    'SAD_FEM',
    'SAD_MASC',
    'HAPPY_FEM',
    'HAPPY_MASC',
    'UNCONVERTED',
    'UNKNOWN',
  ],
  UNCONVERTED: [
    'UNCONVERTED',
    'UNKNOWN',
    'HAPPY_MASC',
    'HAPPY_FEM',
    'SAD_MASC',
    'SAD_FEM',
    'SICK_MASC',
    'SICK_FEM',
  ],
  UNKNOWN: [
    'UNKNOWN',
    'UNCONVERTED',
    'HAPPY_MASC',
    'HAPPY_FEM',
    'SAD_MASC',
    'SAD_FEM',
    'SICK_MASC',
    'SICK_FEM',
  ],
};

export function getClosestPose(
  validPoses: Set<unknown>,
  idealPose: string | number,
) {
  if (!closestPosesInOrder[idealPose]) {
    return 'HAPPY_MASC';
  }
  return (
    closestPosesInOrder[idealPose]?.find((p: unknown) => validPoses.has(p)) ||
    'HAPPY_MASC'
  );
}
