export const findMax = (array: number[]) => {
  return array.reduce((prev, curr) => (curr > prev ? curr : prev), -9999999999);
};
