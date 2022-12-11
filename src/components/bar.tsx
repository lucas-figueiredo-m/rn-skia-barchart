import React, {useEffect} from 'react';
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
  const selected = Selector(barData, v => v[index]);

  useEffect(() => {
    if (index === 0) {
      console.log('selected: ', selected.selector([]));
      console.log('selected: ', selected.value.current[index]);
    }
  }, [index, selected]);
  return (
    <RoundedRect
      x={Selector(barData, v => v[index].x)}
      y={Selector(barData, v => v[index].y)}
      width={width}
      height={Selector(barData, v => v[index].height)}
      r={10}>
      {/* <LinearGradient
        start={vec(Selector(barData, v => v[index].x).selector(), -height)}
        end={vec(x + width.current, 0)}
        colors={['blue', 'cyan']}
      /> */}
    </RoundedRect>
  );
};
