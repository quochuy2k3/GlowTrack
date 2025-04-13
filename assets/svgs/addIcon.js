import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = props => {
  const { width, height, color } = props;
  let Width = width ? width : 25;
  let Height = height ? height : 25;
  let Color = color ? color : '#1975FF';

  return `
<svg  width="${Width}" height="${Height}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.58016 1.81118C8.58016 1.49073 8.32039 1.23096 7.99994 1.23096C7.6795 1.23096 7.41972 1.49073 7.41972 1.81118L7.41972 7.41997H1.81093C1.49049 7.41997 1.23071 7.67974 1.23071 8.00019C1.23071 8.32063 1.49049 8.58041 1.81093 8.58041H7.41972V14.1892C7.41972 14.5096 7.6795 14.7694 7.99994 14.7694C8.32039 14.7694 8.58016 14.5096 8.58016 14.1892V8.58041H14.189C14.5094 8.58041 14.7692 8.32063 14.7692 8.00019C14.7692 7.67974 14.5094 7.41997 14.189 7.41997H8.58016L8.58016 1.81118Z" fill="#838BA3"/>
</svg>



    `;
};

const Icon = props => <SvgXml xml={xml(props)} />;

export default Icon;
