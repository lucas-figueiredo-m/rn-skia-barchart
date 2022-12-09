import React from 'react';
import {LinearGradient, Path, vec} from '@shopify/react-native-skia';
import {useWindowDimensions} from 'react-native';
import {line as lineGen, curveLinear} from 'd3';

type BarProps = {
  width: number;
  height: number;
  x: number;
};

const line = lineGen()
  .curve(curveLinear)
  .x(([x]) => x)
  .y(([, y]) => y);

// const lineGenerator = d3
//   .line()
//   .x(([x]) => x)
//   .y(([, y]) => y);

export const Bar: React.FC<BarProps> = ({width, height, x}) => {
  const {width: totalHeight} = useWindowDimensions();
  const d3Path = line([
    [x, 0],
    [x + width, 0],
    [x + width, -height],
    [x, -height],
    [x, 0],
  ]);
  // const path = `M 0 0 H ${width} V ${-height} H 0 V 0 Z`;
  return (
    <Path
      style="fill"
      strokeCap="round"
      strokeJoin="round"
      path={d3Path as string}
      transform={[{translateY: totalHeight}]}>
      <LinearGradient
        start={vec(x, -height)}
        end={vec(x + width, 0)}
        colors={['blue', 'cyan']}
      />
    </Path>
  );
};
