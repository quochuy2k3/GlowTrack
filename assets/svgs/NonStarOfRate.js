import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = (props) => {
  const { width, height, color } = props;
  let Width = width ? width : 25;
  let Height = height ? height : 25;
  let Color = color ? color : '#1975FF';

  return `
<svg width="${Width}" height="${Height}" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.4766 1.61804L13.5882 8.11701L13.7005 8.4625H14.0637H20.8972L15.3688 12.4791L15.0749 12.6926L15.1872 13.0381L17.2988 19.5371L11.7705 15.5205L11.4766 15.307L11.1827 15.5205L5.65431 19.5371L7.76596 13.0381L7.87821 12.6926L7.58432 12.4791L2.05596 8.4625H8.88939H9.25266L9.36492 8.11701L11.4766 1.61804Z" fill="white" stroke="#F2C71A"/>
</svg>
    `;
};

const Icon = (props) => <SvgXml xml={xml(props)} />;

export default Icon;
