import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = props => {
  const { width = 16, height = 16, color = 'none' } = props;
  return `
     <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="${color}" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="#8C8C8C"/>
</svg>

    `;
};

const Icon = props => <SvgXml xml={xml(props)} />;

export default Icon;
