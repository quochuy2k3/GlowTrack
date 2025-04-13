import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = props => {
  const { width, height, color } = props;
  let Width = width ? width : 25;
  let Height = height ? height : 25;
  let Color = color ? color : '#1975FF';

  return `
<svg width="${Width}" height="${Height}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.7302 16.4043C6.20616 16.4045 5.70357 16.1962 5.33333 15.8253L1.1101 11.6037C0.655682 11.1491 0.655682 10.4122 1.1101 9.95767C1.56467 9.50325 2.30152 9.50325 2.75609 9.95767L6.7302 13.9318L17.244 3.41796C17.6986 2.96354 18.4354 2.96354 18.89 3.41796C19.3444 3.87253 19.3444 4.60938 18.89 5.06395L8.12708 15.8253C7.75683 16.1962 7.25425 16.4045 6.7302 16.4043Z" fill="#303E65"/>
</svg>
    `;
};

const Icon = props => <SvgXml xml={xml(props)} />;

export default Icon;
