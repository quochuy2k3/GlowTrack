import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { YStack } from 'tamagui';
import variables from '@/theme/commonColor';
import commonColor from '@/theme/commonColor';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
export default function DayCard({ day, isToday, hasDetail }: any) {
  const { t } = useTranslation();
  const weekDays = [t('Sun'), t('Mon'), t('Tue'), t('Wed'), t('Thu'), t('Fri'), t('Sat')];
  const weekDayIndex = moment(day.date).day();
  const router = useRouter();
  const handlePress = () => {
    if (day.tracker_id && day.tracker_id.length > 0) {
      router.push(`../(tracker)/detail?trackerId=${day.tracker_id}`);
    }
  };
  const dotIcon = () => {
    const color = hasDetail
      ? commonColor.ColorMalachite
      : isToday
        ? commonColor.ColorWarning
        : commonColor.ColorReddish;
    return <View style={[styles.dot, { backgroundColor: color }]}></View>;
  };

  return (
    <TouchableOpacity onPress={handlePress} key={day.date}>
      <YStack style={[styles.container, isToday && styles.containerToday]}>
        <Text style={[styles.dayText]}>{weekDays[weekDayIndex]}</Text>
        <Text style={[styles.numberDayText, isToday && styles.numberDayTextToday]}>
          {moment(day.date).date()}
        </Text>
        {day.date <= moment().format('YYYY-MM-DD') && dotIcon()}
      </YStack>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: variables.scale(14),
    paddingHorizontal: variables.scale(24),
    borderRadius: variables.scale(14),
    backgroundColor: 'rgba(228, 247, 227, 0.93)',
    justifyContent: 'flex-start',
    maxHeight: variables.scale(130),
  },
  containerToday: {
    borderWidth: 1.5,
    borderColor: variables.colorPrimary,
    backgroundColor: commonColor.ColorWhite,
  },
  dayText: {
    fontSize: variables.scale(26),
    color: commonColor.ColorGrey,
    fontFamily: variables.fontFamilyMedium,
  },
  numberDayText: {
    fontSize: variables.scale(36),
    fontFamily: variables.fontFamilyMedium,
  },
  dot: {
    marginTop: variables.scale(10),
    width: variables.scale(8),
    height: variables.scale(8),
    borderRadius: variables.scale(15),
    backgroundColor: variables.ColorWarning,
    marginHorizontal: variables.scale(1),
  },
  numberDayTextToday: {
    color: variables.colorPrimary,
    fontFamily: variables.fontFamilyBold,
  },
});
