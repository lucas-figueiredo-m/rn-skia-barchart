import {
  Canvas,
  mix,
  useComputedValue,
  useValue,
} from '@shopify/react-native-skia';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {CANVA_HEIGHT, CANVA_WIDTH} from '../constants/barConstants';
import {SegmentedControl} from '../components/SegmentedControl';
import {data} from '../assets/data';
import {barHeightScale, getBarWidth, getBarX} from '../utils/barUtils';
import {Bar} from '../components/bar';

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

    const maxLength = data.reduce(
      (prev, curr) => Math.max(prev, curr.data.length),
      -1,
    );

    const startMax = Math.max(...data[previous].data);
    const endMax = Math.max(...data[current].data);

    const startLengthDiff = Math.abs(maxLength - startDataLength);
    const endLengthDiff = Math.abs(maxLength - endDataLength);

    const startFillerArray = new Array(startLengthDiff).fill(0);
    const endFillerArray = new Array(endLengthDiff).fill(0);

    const startData = data[previous].data
      .concat(startFillerArray)
      .map((value, index) => ({
        x: getBarX(startDataLength, index, barWidth.current),
        y: CANVA_HEIGHT - barHeightScale(value, startMax),
        height: barHeightScale(value, startMax),
      }));

    const endData = data[current].data
      .concat(endFillerArray)
      .map((value, index) => ({
        x: getBarX(endDataLength, index, barWidth.current),
        y: CANVA_HEIGHT - barHeightScale(value, endMax),
        height: barHeightScale(value, endMax),
      }));

    return new Array(maxLength).fill(0).map((_, i) => {
      const start = startData[i];
      const end = endData[i];
      return {
        x: mix(transition.current, start.x, end.x),
        y: mix(transition.current, start.y, end.y),
        height: mix(transition.current, start.height, end.height),
      };
    });
  }, [state, transition, barWidth]);

  const rendererArray = new Array(
    data.reduce((prev, curr) => Math.max(prev, curr.data.length), -1),
  ).fill(0);

  return (
    <SafeAreaView style={styles.root}>
      <Canvas style={styles.canvas}>
        {rendererArray.map((_, index) => (
          <Bar key={index} width={barWidth} barData={barData} index={index} />
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
