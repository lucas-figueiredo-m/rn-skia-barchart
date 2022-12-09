import {
  Canvas,
  Path,
  SkPath,
  useComputedValue,
  useValue,
} from '@shopify/react-native-skia';
import React from 'react';
import {SafeAreaView, StyleSheet, useWindowDimensions} from 'react-native';
import {CANVA_HEIGHT, CANVA_WIDTH} from '../constants/barConstants';
import {SegmentedControl} from '../components/SegmentedControl';
import {data} from '../assets/data';
import {makeChart} from '../utils/chartUtils';

const BarChartScreen: React.FC = () => {
  const transition = useValue(0);
  const {width} = useWindowDimensions();

  const state = useValue({next: 0, current: 1});

  const barWidth2 = useComputedValue(() => {}, []);

  const graphData = data.map(chartData => makeChart(chartData.data));

  const path = useComputedValue(() => {
    const start = graphData[state.current.current].curve as SkPath;
    const end = graphData[state.current.next].curve as SkPath;
    const result = start.interpolate(end, transition.current);
    return result?.toSVGString() ?? '0';
  }, [state, transition]);

  return (
    <SafeAreaView style={styles.root}>
      <Canvas style={styles.canvas}>
        {/* {dataItems.current.map((value, index) => {
          return (
            <Bar
              key={index}
              x={getBarX(dataLen, index)}
              width={getBarWidth(dataLen)}
              height={barHeightScale(value, dataItems.current)}
            />
          );
        })} */}
        <Path
          style="fill"
          strokeCap="round"
          strokeJoin="round"
          path={path}
          transform={[{translateY: width}]}
        />
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
