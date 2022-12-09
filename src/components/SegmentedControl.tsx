import {
  Canvas,
  Group,
  LinearGradient,
  mix,
  RoundedRect,
  runSpring,
  SkiaMutableValue,
  useComputedValue,
  vec,
} from '@shopify/react-native-skia';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {data} from '../assets/data';
import {BUTTON_HEIGHT} from '../constants/segmentedControl';

export interface GraphState {
  next: number;
  current: number;
}

type SegmentedControlProps = {
  state: SkiaMutableValue<GraphState>;
  transition: SkiaMutableValue<number>;
};

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  state,
  transition,
}) => {
  const {width} = useWindowDimensions();

  const buttonWidth = (width - 16 * 2) / 3;

  const transform = useComputedValue(() => {
    const {current, next} = state.current;

    return [
      {
        translateX: mix(
          transition.current,
          current * buttonWidth,
          next * buttonWidth,
        ),
      },
    ];
  }, [state, transition]);

  const onPress = (index: number) => {
    state.current.current = state.current.next;
    state.current.next = index;
    transition.current = 0;
    runSpring(transition, 1, {
      damping: 100,
    });
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Canvas style={StyleSheet.absoluteFill}>
          <Group transform={transform}>
            <RoundedRect
              x={0}
              y={0}
              width={buttonWidth}
              height={BUTTON_HEIGHT}
              r={20}>
              <LinearGradient
                start={vec(0, 0)}
                end={vec(buttonWidth, BUTTON_HEIGHT)}
                colors={['blue', 'cyan']}
              />
            </RoundedRect>
          </Group>
        </Canvas>
        {data.map((value, index) => (
          <TouchableOpacity
            // activeOpacity={1}
            style={styles.button}
            key={index}
            onPress={() => onPress(index)}>
            <Text style={styles.label}>{value.period}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 16,
    width: '100%',
  },
  canvas: {
    width: '100%',
    height: BUTTON_HEIGHT,
  },
  container: {
    flexDirection: 'row',
    borderRadius: 20,
    height: BUTTON_HEIGHT,
  },
  button: {
    height: BUTTON_HEIGHT,
    width: '33.3333%',
    // width: BUTTON_WIDTH,
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'blue',
    borderRadius: 20,
  },
  label: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    // textAlign: 'center',
  },
});
