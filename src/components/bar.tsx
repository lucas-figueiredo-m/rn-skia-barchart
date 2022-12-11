import React from 'react';
import {
  LinearGradient,
  RoundedRect,
  Selector,
  SkiaValue,
  vec,
} from '@shopify/react-native-skia';

export type BarData = {
  x: number;
  y: number;
  height: number;
};

type BarProps = {
  width: SkiaValue<number>;
  index: number;
  barData: SkiaValue<BarData[]>;
};

export const Bar: React.FC<BarProps> = ({width, barData, index}) => {
  const selected = Selector(barData, v => v[index]).value.current[index];

  return (
    <RoundedRect
      x={Selector(barData, v => v[index].x)}
      y={Selector(barData, v => v[index].y)}
      width={width}
      height={Selector(barData, v => v[index].height)}
      r={10}>
      <LinearGradient
        start={vec(selected.x, selected.y)}
        end={vec(selected.x, selected.y + selected.height)}
        colors={['blue', 'cyan']}
      />
    </RoundedRect>
  );
};
