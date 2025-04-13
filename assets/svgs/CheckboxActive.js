import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = props => {
  const {
    width = 16,
    height = 16,
    color = 'none',
    colorBg = '#1ECC78',
    colorFill = 'white',
  } = props;
  return `
<svg width="${width}" height="${width}" viewBox="0 0 ${width} ${width}" fill="${color}" xmlns="http://www.w3.org/2000/svg">
<rect width="16" height="16" rx="4" fill="${colorBg}"/>
<path d="M6.03798 11.8425C5.72355 11.8426 5.422 11.7176 5.19985 11.4951L2.66592 8.9621C2.39326 8.68936 2.39326 8.24725 2.66592 7.97451C2.93866 7.70185 3.38077 7.70185 3.65351 7.97451L6.03798 10.359L12.3463 4.05068C12.619 3.77803 13.0611 3.77803 13.3339 4.05068C13.6065 4.32342 13.6065 4.76553 13.3339 5.03827L6.8761 11.4951C6.65395 11.7176 6.3524 11.8426 6.03798 11.8425Z" fill="${colorFill}"/>
</svg>

    `;
};

const Icon = props => <SvgXml xml={xml(props)} />;

export default Icon;
