import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = (props) => {
  const { width, height, color } = props;
  let Width = width ? width : 25;
  let Height = height ? height : 25;
  let Color = color ? color : '#1975FF';

  return `
<svg width="${Width}" height="${Height}" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.5234 0L14.1106 7.9625H22.4829L15.7096 12.8836L18.2967 20.8461L11.5234 15.925L4.75013 20.8461L7.3373 12.8836L0.563997 7.9625H8.93626L11.5234 0Z" fill="#F2C71A"/>
</svg>
    `;
};

const Icon = (props) => <SvgXml xml={xml(props)} />;

export default Icon;
