import {
  Canvas,
  Path,
  Skia,
  SkPath,
  useComputedValue,
  useValue,
} from '@shopify/react-native-skia';
import React from 'react';
import {SafeAreaView, StyleSheet, useWindowDimensions} from 'react-native';
import {CANVA_HEIGHT, CANVA_WIDTH} from '../constants/barConstants';
import {barHeightScale, getBarWidth, getBarX} from '../utils/barUtils';
import {SegmentedControl} from '../components/SegmentedControl';
import {line as lineGen, curveLinear} from 'd3';
import {data} from '../assets/data';

const line = lineGen()
  .curve(curveLinear)
  .x(([x]) => x)
  .y(([, y]) => y);

const BarChartScreen: React.FC = () => {
  const transition = useValue(0);
  const {width} = useWindowDimensions();

  const state = useValue({next: 0, current: 1});

  const makeChart = (dataPoints: number[]) => {
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

    console.log('barsPath: ', barsPath.toString());

    const bars = barsPath.join(' ');

    console.log('barsPath: ', bars);
    const skPath = Skia.Path.MakeFromSVGString(bars);

    return {
      max,
      min,
      curve: skPath,
    };
  };

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
          // path={graphData[0].curve?.toSVGString()}
          path={path}
          transform={[{translateY: width}]}>
          {/* <LinearGradient
            start={vec(x, -height)}
            end={vec(x + width, 0)}
            colors={['blue', 'cyan']}
          /> */}
        </Path>
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
