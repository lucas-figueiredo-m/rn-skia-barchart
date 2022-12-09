import {Skia} from '@shopify/react-native-skia';
import {getBarWidth, getBarX, barHeightScale} from './barUtils';
import {line} from './d3Utils';

export const makeChart = (dataPoints: number[]) => {
  const max = Math.max(...dataPoints);
  const min = Math.min(...dataPoints);
  const barWidth = getBarWidth(dataPoints.length);

  const barsPath = dataPoints.map((value, index) => {
    const x = getBarX(dataPoints.length, index);
    const height = barHeightScale(value, max);
    const d3Path = line([
      [x, 0],
      [x + barWidth, 0],
      [x + barWidth, -height],
      [x, -height],
      [x, 0],
    ]);

    return String(d3Path);
  });

  const bars = barsPath.join(' ');
  const skPath = Skia.Path.MakeFromSVGString(bars);

  return {
    max,
    min,
    curve: skPath,
  };
};
