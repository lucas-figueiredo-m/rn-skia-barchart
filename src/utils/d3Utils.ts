import {line as lineGen, curveLinear} from 'd3';

export const line = lineGen()
  .curve(curveLinear)
  .x(([x]) => x)
  .y(([, y]) => y);
