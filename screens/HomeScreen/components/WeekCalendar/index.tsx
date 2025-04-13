import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { XStack } from 'tamagui';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import DayCard from './components/DayCard';
import variables from '@/theme/commonColor';
import commonColor from '@/theme/commonColor';
import IconArrowRight from '@/assets/svgs/IconArrowRight';
export default function WeekCalendar() {
  const { t } = useTranslation();
  const [currentDay, setCurrentDay] = useState(new Date().getDate());
  const [selectedDay, setSelectedDay] = useState(null);
  const [weekData, setWeekData] = useState([]);
  const weekDays = [t('Mon'), t('Tue'), t('Wed'), t('Thu'), t('Fri'), t('Sat'), t('Sun')];

  const getListDaysOfWeek = () => {
    const startOfWeek = moment().startOf('isoWeek');
    const daysOfWeek = [];

    for (let i = 0; i < 7; i++) {
      daysOfWeek.push({
        date: startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD'),
        day: startOfWeek.clone().add(i, 'days').format('D'),
        weekDay: weekDays[i],
      });
    }

    return daysOfWeek;
  };

  useEffect(() => {
    const currentDate = new Date();
    setCurrentDay(currentDate.getDate());

    generateFakeData();
  }, []);

  const generateFakeData = () => {
    const daysOfWeek = getListDaysOfWeek();
    const fakeData = daysOfWeek.map(day => {
      return {
        date: day.date,
        isHasValue: Math.random() > 0.5,
      };
    });
    setWeekData(fakeData);
  };

  const handleDayPress = (day: string) => {
    setSelectedDay(day);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.title}>
        <Text style={styles.titleText}>{t('Tracker')}</Text>
        <IconArrowRight />
      </TouchableOpacity>
      <XStack gap="$1" px="$3" style={{ flex: 1 }} justifyContent="space-between">
        {getListDaysOfWeek().map((day, index) => {
          const dayData = weekData.find(d => d.date === day.date);

          return (
            <DayCard
              key={day.date}
              day={day}
              index={index}
              isSelected={selectedDay === day.date}
              isToday={day.day == currentDay}
              hasDetail={dayData && dayData.isHasValue}
              onPress={handleDayPress}
            />
          );
        })}
      </XStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: variables.scale(270),
    marginHorizontal: variables.scale(18),
    marginTop: variables.scale(20),
    borderRadius: variables.scale(30),
    backgroundColor: commonColor.ColorWhite,
    paddingVertical: variables.scale(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: variables.scale(3),
    elevation: 2,
    boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.07)',
  },
  title: {
    paddingVertical: variables.scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: variables.scale(20),
    justifyContent: 'space-between',
    paddingHorizontal: variables.scale(30),
  },
  titleText: {
    fontSize: variables.scale(36),
    fontFamily: variables.fontFamilyBold,
  },
});
