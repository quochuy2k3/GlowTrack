import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = props => {
  const { width = 9, height = 16, color = '#8793B4' } = props;

  return `
  <svg width="${width}"
  height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0.226756 15.7732C-0.0480998 15.4984 -0.0730867 15.0683 0.151795 14.7652L0.226756 14.6784L6.90477 8L0.226756 1.32163C-0.0480998 1.04677 -0.0730867 0.616672 0.151795 0.313588L0.226756 0.226757C0.501612 -0.0480995 0.931716 -0.0730858 1.2348 0.151796L1.32163 0.226757L8.54744 7.45256C8.82229 7.72742 8.84728 8.15752 8.6224 8.46061L8.54744 8.54744L1.32163 15.7732C1.01929 16.0756 0.529097 16.0756 0.226756 15.7732Z" fill="${color}"/>
  </svg>
    `;
};

const Icon = props => <SvgXml xml={xml(props)} />;

export default Icon;
