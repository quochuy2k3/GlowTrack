import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

async function initDayjs() {
  let savedLanguage = await AsyncStorage.getItem('language');

  if (!savedLanguage) {
    savedLanguage = getLocales()[1]?.languageCode;
    if (savedLanguage === 'en') {
      savedLanguage = 'en';
    } else {
      savedLanguage = 'vi';
    }
  }

  dayjs.locale(savedLanguage);
}

initDayjs();

export default dayjs;
