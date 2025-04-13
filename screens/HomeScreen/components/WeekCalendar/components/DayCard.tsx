import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { YStack } from 'tamagui';
import variables from '@/theme/commonColor';
import commonColor from '@/theme/commonColor';
import moment from 'moment';
export default function DayCard({ day, isSelected, isToday, onPress, hasDetail }) {
  const handlePress = () => {
    onPress(day.date); // Pass the date to the onPress function
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
    <TouchableOpacity
    //   style={[
    //     styles.card,
    //     isSelected && styles.selectedCard,
    //     isToday && styles.todayCard,
    //     hasDetail && styles.hasDetailCard, // Add a special style for days with details
    //   ]}
    //   onPress={handlePress}
    // >
    //   <Text
    //     style={[styles.dayText, isSelected && styles.selectedText, isToday && styles.todayText]}
    //   >
    //     {day.weekDay} {day.day}
    //   </Text>
    //   {hasDetail && <Text style={styles.detailText}>Has Details</Text>}{' '}
    //   {/* Show a label if there are details */}
    >
      <YStack style={[styles.container, isToday && styles.containerToday]}>
        <Text style={styles.dayText}>{day.weekDay}</Text>
        <Text style={[styles.numberDayText, isToday && styles.numberDayTextToday]}>{day.day}</Text>
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
