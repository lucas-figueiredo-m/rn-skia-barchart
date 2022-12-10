import {
  Canvas,
  mix,
  RoundedRect,
  Selector,
  useComputedValue,
  useValue,
} from '@shopify/react-native-skia';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {CANVA_HEIGHT, CANVA_WIDTH} from '../constants/barConstants';
import {SegmentedControl} from '../components/SegmentedControl';
import {data} from '../assets/data';
import {barHeightScale, getBarWidth, getBarX2} from '../utils/barUtils';

const BarChartScreen: React.FC = () => {
  const transition = useValue(0);

  const state = useValue({current: 0, previous: 0});

  const barWidth = useComputedValue(() => {
    const {previous, current} = state.current;

    const startDataLength = data[previous].data.length;
    const endDataLength = data[current].data.length;

    const startWidth = getBarWidth(startDataLength);
    const endWidth = getBarWidth(endDataLength);

    return mix(transition.current, startWidth, endWidth);
  }, [state, transition]);

  const barData = useComputedValue(() => {
    const {previous, current} = state.current;

    const startDataLength = data[previous].data.length;
    const endDataLength = data[current].data.length;

    const startMax = Math.max(...data[previous].data);
    const endMax = Math.max(...data[current].data);

    let startData: {x: number; y: number; height: number}[];
    let endData: {x: number; y: number; height: number}[];

    const lengthDiff = Math.abs(startDataLength - endDataLength);

    if (startDataLength < endDataLength) {
      startData = [
        ...data[previous].data,
        ...new Array(lengthDiff).fill(0),
      ].map((value, index) => ({
        x: getBarX2(startDataLength, index, barWidth.current),
        y: CANVA_HEIGHT - barHeightScale(value, startMax),
        height: barHeightScale(value, startMax),
      }));

      endData = data[current].data.map((value, index) => ({
        x: getBarX2(endDataLength, index, barWidth.current),
        y: CANVA_HEIGHT - barHeightScale(value, endMax),
        height: barHeightScale(value, endMax),
      }));
    } else if (startDataLength > endDataLength) {
      startData = data[previous].data.map((value, index) => ({
        x: getBarX2(startDataLength, index, barWidth.current),
        y: CANVA_HEIGHT - barHeightScale(value, startMax),
        height: barHeightScale(value, startMax),
      }));

      endData = [...data[current].data, ...new Array(lengthDiff).fill(0)].map(
        (value, index) => ({
          x: getBarX2(endDataLength, index, barWidth.current),
          y: CANVA_HEIGHT - barHeightScale(value, endMax),
          height: barHeightScale(value, endMax),
        }),
      );
    } else {
      startData = data[previous].data.map((value, index) => ({
        x: getBarX2(startDataLength, index, barWidth.current),
        y: CANVA_HEIGHT - barHeightScale(value, startMax),
        height: barHeightScale(value, startMax),
      }));

      endData = data[current].data.map((value, index) => ({
        x: getBarX2(endDataLength, index, barWidth.current),
        y: CANVA_HEIGHT - barHeightScale(value, endMax),
        height: barHeightScale(value, endMax),
      }));
    }

    return new Array(startData.length).fill(0).map((_, i) => {
      const start = startData[i];
      const end = endData[i];
      return {
        x: mix(transition.current, start.x, end.x),
        y: mix(transition.current, start.y, end.y),
        height: mix(transition.current, start.height, end.height),
      };
    });
  }, [state, transition, barWidth]);

  return (
    <SafeAreaView style={styles.root}>
      <Canvas style={styles.canvas}>
        {data[state.current.current].data.map((_, index) => (
          <RoundedRect
            key={index}
            x={Selector(barData, v => v[index].x)}
            y={Selector(barData, v => v[index].y)}
            width={barWidth}
            height={Selector(barData, v => v[index].height)}
            r={5}
          />
        ))}
      </Canvas>
      <SegmentedControl state={state} transition={transition} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  canvas: {
    width: CANVA_WIDTH,
    height: CANVA_HEIGHT,
    backgroundColor: 'white',
  },
});

export default BarChartScreen;
