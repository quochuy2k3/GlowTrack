import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = props => {
  const { width, height, color } = props;
  let Width = width ? width : 25;
  let Height = height ? height : 25;
  let Color = color ? color : '#1975FF';

  return `
<svg width="${Width}" height="${Height}" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.0034677 6.99681C0.0034677 5.11717 0.0034677 3.23754 0.0034677 1.3579C0.0034677 1.01807 0.0585443 0.695812 0.28471 0.429803C0.725323 -0.0916664 1.42843 -0.146743 2.00146 0.309104C2.54168 0.73917 3.06784 1.18799 3.59868 1.62977C5.32012 3.06176 7.04038 4.49375 8.76064 5.92692C9.55633 6.59018 9.54695 7.41633 8.75479 8.07256C6.53649 9.91118 4.32171 11.7545 2.10575 13.5966C1.77295 13.8732 1.41085 14.0724 0.958519 13.9728C0.363223 13.8415 0.0362793 13.4314 0.00581138 12.781C-0.0047352 12.5677 0.00229585 12.3521 0.00229585 12.1389C0.00229585 10.4244 0.00229585 8.71121 0.00229585 6.99681H0.0034677Z" fill="#303E65"/>
</svg>

    `;
};

const Icon = props => <SvgXml xml={xml(props)} />;

export default Icon;
