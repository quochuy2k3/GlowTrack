import * as React from 'react';
import { Platform } from 'react-native';
import { SvgXml } from 'react-native-svg';

const xml = props => {
  const { width, height, color, borderColor, borderWidth } = props;
  let Width = width ? width : 25;
  let Height = height ? height : 25;
  let Color = color ? color : '#1975FF';
  let BorderColor = borderColor ? borderColor : '#1975FF';
  let BorderWidth = borderWidth ? borderWidth : 0.5;
  let ViewBox = Platform.OS === 'android' ? '0 0 375 30' : '0 0 375 70';

  return `
  <svg width="${Width}" height="${Height}" viewBox="${ViewBox}" fill="none">
    <path fill="${Color}" stroke="${BorderColor}" stroke-width="${BorderWidth}" d="M0,0 H120 C145,0 155,36 187.5,36 C220,36 230,0 250,0 H375 V90 H0 Z" />
  </svg>
  `;
};

const Icon = props => <SvgXml xml={xml(props)} />;

export default Icon;
