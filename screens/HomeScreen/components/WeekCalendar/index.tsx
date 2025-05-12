import React, { useState, useEffect, MutableRefObject } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { XStack, Spinner, YStack } from 'tamagui';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import DayCard from './components/DayCard';
import variables from '@/theme/commonColor';
import commonColor from '@/theme/commonColor';
import IconArrowRight from '@/assets/svgs/IconArrowRight';
import { useServices } from '@/services';
import { useQuery } from 'react-query';
import { useAuth } from '@/contexts/auth';
import { useRouter } from 'expo-router';

interface WeekCalendarProps {
  onRefresh?: MutableRefObject<(() => void) | undefined>;
}

export default function WeekCalendar({ onRefresh }: WeekCalendarProps) {
  const services = useServices();
  const auth = useAuth();
  const { t } = useTranslation();
  const [currentDay, setCurrentDay] = useState(new Date().getDate());
  const router = useRouter();

  // Query to fetch week data
  const {
    data: weekData,
    isLoading,
    isError,
    refetch: refetchWeekData,
  } = useQuery({
    queryKey: ['weekData'],
    queryFn: () => services.TrackerService.getWeekTracker(),
    enabled: auth.isAuthenticated,
    staleTime: 0, // Data is always stale, forcing refetch when components remount
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  useEffect(() => {
    const currentDate = new Date();
    setCurrentDay(currentDate.getDate());
  }, []);

  // Expose refetch function to parent component
  useEffect(() => {
    if (onRefresh) {
      onRefresh.current = refetchWeekData;
    }
  }, [onRefresh, refetchWeekData]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.title} onPress={() => router.push('../(tracker)')}>
          <Text style={styles.titleText}>{t('Tracker')}</Text>
          <IconArrowRight />
        </TouchableOpacity>
        <View style={styles.spinnerContainer}>
          <Spinner size="large" color={commonColor.btnPrimaryColor} />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.title} onPress={() => router.push('../(tracker)')}>
          <Text style={styles.titleText}>{t('Tracker')}</Text>
          <IconArrowRight />
        </TouchableOpacity>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading data</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetchWeekData()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.title} onPress={() => router.push('../(tracker)')}>
        <Text style={styles.titleText}>{t('Tracker')}</Text>
        <IconArrowRight />
      </TouchableOpacity>
      <View style={styles.daysContainer}>
        {Array.isArray(weekData) &&
          weekData.map((day: any, index: number) => {
            const dayData =
              Array.isArray(weekData) && weekData.find((d: any) => d.date === day.date);

            return (
              <DayCard
                key={day.date}
                day={day}
                index={index}
                isToday={moment(day.date).date() === currentDay}
                hasDetail={dayData && dayData.isHasValue}
              />
            );
          })}
      </View>
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
  daysContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: variables.scale(12),
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: variables.scale(16),
    fontFamily: variables.fontFamilyMedium,
    color: '#FF3B30',
    marginBottom: variables.scale(10),
  },
  retryButton: {
    paddingHorizontal: variables.scale(20),
    paddingVertical: variables.scale(8),
    backgroundColor: commonColor.btnPrimaryColor,
    borderRadius: variables.scale(20),
  },
  retryText: {
    fontSize: variables.scale(14),
    fontFamily: variables.fontFamilyMedium,
    color: commonColor.ColorWhite,
  },
});
