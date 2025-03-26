import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = props => {
  const { width, height, color } = props;
  let Width = width ? width : 25;
  let Height = height ? height : 25;
  let Color = color ? color : '#1975FF';

  return `
<svg width="${Width}" height="${Height}" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.0625 11C2.0625 6.06396 6.06396 2.0625 11 2.0625C15.936 2.0625 19.9375 6.06396 19.9375 11C19.9375 15.936 15.936 19.9375 11 19.9375C6.06396 19.9375 2.0625 15.936 2.0625 11ZM14.918 10.0986C15.6252 10.4915 15.6252 11.5086 14.918 11.9015L9.78207 14.7548C9.09471 15.1367 8.25 14.6396 8.25 13.8533L8.25 8.14675C8.25 7.36043 9.09471 6.86341 9.78207 7.24527L14.918 10.0986Z" fill="white"/>
</svg>




    `;
};

const Icon = props => <SvgXml xml={xml(props)} />;

export default Icon;
