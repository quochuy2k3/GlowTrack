import { AnimationObject } from 'lottie-react-native';
export interface OnboardingData {
  id: number;
  animation: AnimationObject;
  text: string;
  subtext: string;
  textColor: string;
  backgroundColor: string;
}

const data: OnboardingData[] = [
  {
    id: 1,
    animation: require('../assets/animations/Lottie6.json'),
    text: 'lottie1',
    subtext: 'subLottie1',
    textColor: '#005b4f',
    backgroundColor: 'rgb(255, 255, 255)',
  },
  {
    id: 2,
    animation: require('../assets/animations/Lottie2.json'),
    text: 'lottie2',
    subtext: 'subLottie2',
    textColor: 'rgb(109, 20, 100)',
    backgroundColor: 'rgb(221, 209, 255)',
  },
  {
    id: 3,
    animation: require('../assets/animations/Lottie3.json'),
    text: 'lottie3',
    subtext: 'subLottie3',
    textColor: '#1e2169',
    backgroundColor: 'rgb(206, 242, 255)',
  },
  {
    id: 4,
    animation: require('../assets/animations/Lottie4.json'),
    text: 'lottie4',
    subtext: 'subLottie4',
    textColor: '#005b4f',
    backgroundColor: 'rgb(255, 255, 255)',
  },
];
export default data;
