import * as React from 'react';
import { SvgXml } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const xml = (props: IconProps): string => {
  const { width, height, color } = props;
  const Width = width || 25;
  const Height = height || 25;
  const Color = color || '#1975FF';

  return `
<svg width="${Width}" height="${Height}"  viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.46153 3.84608C8.46153 4.69575 9.15032 5.38454 9.99999 5.38454C10.8497 5.38454 11.5385 4.69575 11.5385 3.84608C11.5385 2.99641 10.8497 2.30762 9.99999 2.30762C9.15032 2.30762 8.46153 2.99641 8.46153 3.84608Z" fill="black"/>
<path d="M8.46153 9.99989C8.46153 10.8496 9.15032 11.5383 9.99999 11.5383C10.8497 11.5383 11.5385 10.8496 11.5385 9.99989C11.5385 9.15022 10.8497 8.46143 9.99999 8.46143C9.15032 8.46143 8.46153 9.15022 8.46153 9.99989Z" fill="black"/>
<path d="M8.46153 16.1537C8.46153 17.0034 9.15032 17.6922 9.99999 17.6922C10.8497 17.6922 11.5385 17.0034 11.5385 16.1537C11.5385 15.304 10.8497 14.6152 9.99999 14.6152C9.15032 14.6152 8.46153 15.304 8.46153 16.1537Z" fill="black"/>
</svg>

    `;
};

const Icon: React.FC<IconProps> = props => <SvgXml xml={xml(props)} />;

export default Icon;
