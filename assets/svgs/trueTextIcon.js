import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = (props) => {
  const { width, height, color } = props;
  let Width = width ? width : 25;
  let Height = height ? height : 25;
  let Color = color ? color : 'none';

  return `
<svg width="${Width}" height="${Height}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.38421 13.1232C4.96497 13.1234 4.56291 12.9568 4.26671 12.6601L0.888131 9.28276C0.524594 8.9191 0.524594 8.32962 0.888131 7.96597C1.25178 7.60243 1.84127 7.60243 2.20492 7.96597L5.38421 11.1453L13.7953 2.7342C14.1589 2.37066 14.7484 2.37066 15.1121 2.7342C15.4756 3.09785 15.4756 3.68734 15.1121 4.05099L6.50171 12.6601C6.20552 12.9568 5.80345 13.1234 5.38421 13.1232Z" fill="#1ECC78"/>
</svg>
    `;
};

const Icon = (props) => <SvgXml xml={xml(props)} />;

export default Icon;
