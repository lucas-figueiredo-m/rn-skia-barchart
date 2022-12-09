import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

export const CANVA_WIDTH = width;
export const CANVA_HEIGHT = CANVA_WIDTH;
export const BAR_MAX_HEIGHT = CANVA_HEIGHT * 0.8;
export const CANVAS_H_MARGINS = 20;
export const BAR_SPACING = 60;
export const BARS_TOTAL_WIDTH_RATE = 0.8;
export const BAR_SPACING_TOTAL_WIDTH_RATE = 1 - BARS_TOTAL_WIDTH_RATE;
