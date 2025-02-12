/**
 * Remaps a value from one range to another.
 * @param value - The input value to remap.
 * @param inMin - The minimum value of the input range.
 * @param inMax - The maximum value of the input range.
 * @param outMin - The minimum value of the output range.
 * @param outMax - The maximum value of the output range.
 * @returns The remapped value.
 */
export function remap(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}
