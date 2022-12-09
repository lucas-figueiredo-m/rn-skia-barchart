import {
  BARS_TOTAL_WIDTH_RATE,
  BAR_MAX_HEIGHT,
  BAR_SPACING_TOTAL_WIDTH_RATE,
  CANVAS_H_MARGINS,
  CANVA_WIDTH,
} from '../constants/barConstants';
// import {findMax} from './math';

export const barHeightScale = (value: number, max: number) => {
  // const max = findMax(dataValues);

  return (value * BAR_MAX_HEIGHT) / max;
};

export const getBarWidth = (dataPoints: number): number => {
  const totalBarWidth =
    CANVA_WIDTH * BARS_TOTAL_WIDTH_RATE - 2 * CANVAS_H_MARGINS;

  return totalBarWidth / dataPoints;
};

export const getBarX = (dataPoints: number, barIndex: number) => {
  const totalSpaceWidth = CANVA_WIDTH * BAR_SPACING_TOTAL_WIDTH_RATE;
  return (
    CANVAS_H_MARGINS +
    barIndex * getBarWidth(dataPoints) +
    (barIndex * totalSpaceWidth) / (dataPoints - 1)
  );
};

// export const buildBarChart = (
//   dataPoints: nu
// )
