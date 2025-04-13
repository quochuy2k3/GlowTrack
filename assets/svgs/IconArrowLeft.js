import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = props => {
  const { width = 9, height = 16, color = '#8793B4' } = props;

  return `
  <svg   width="${width}"
  height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.54741 0.226756C8.82227 0.501612 8.84726 0.931716 8.62237 1.2348L8.54741 1.32163L1.8694 8L8.54741 14.6784C8.82227 14.9532 8.84726 15.3833 8.62237 15.6864L8.54741 15.7732C8.27256 16.0481 7.84245 16.0731 7.53937 15.8482L7.45254 15.7732L0.226733 8.54744C-0.0481227 8.27258 -0.07311 7.84248 0.151772 7.53939L0.226733 7.45256L7.45254 0.226756C7.75488 -0.0755853 8.24507 -0.0755853 8.54741 0.226756Z" fill="${color}"/>
  </svg>
    `;
};

const Icon = props => <SvgXml xml={xml(props)} />;

export default Icon;
