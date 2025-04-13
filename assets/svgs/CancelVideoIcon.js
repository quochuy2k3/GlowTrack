import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = props => {
  const { width, height, color } = props;
  let Width = width ? width : 25;
  let Height = height ? height : 25;
  let Color = color ? color : '#1975FF';

  return `
<svg width="${Width}" height="${Height}" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.95165 6.99996L12.1874 2.76469C12.4503 2.50176 12.4503 2.07546 12.1874 1.81255C11.9245 1.54962 11.4982 1.54962 11.2353 1.81255L6.99996 6.04827L2.76469 1.81255C2.50176 1.54962 2.07546 1.54962 1.81255 1.81255C1.54964 2.07549 1.54962 2.50178 1.81255 2.76469L6.04827 6.99996L1.81255 11.2353C1.54962 11.4982 1.54962 11.9245 1.81255 12.1874C2.07549 12.4503 2.50178 12.4503 2.76469 12.1874L6.99996 7.95165L11.2352 12.1874C11.4982 12.4503 11.9245 12.4503 12.1874 12.1874C12.4503 11.9245 12.4503 11.4982 12.1874 11.2353L7.95165 6.99996Z" fill="#303E65"/>
</svg>


    `;
};

const Icon = props => <SvgXml xml={xml(props)} />;

export default Icon;
