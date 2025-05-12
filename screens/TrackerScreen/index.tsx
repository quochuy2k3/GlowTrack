import { View, Text } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  LucideCalendar,
  LucideChevronDown,
  LucideChevronLeft,
  LucideChevronRight,
} from 'lucide-react-native';
import {
  StatusBar,
  Modal,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import { LucideArrowLeft, LucideCamera } from 'lucide-react-native';
import { router, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import commonColor from '@/theme/commonColor';
import variables from '@/theme/commonColor';
import { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { useQuery } from 'react-query';
import { useAuth } from '@/contexts/auth';
import { TrackerService } from '@/services/tracker/tracker.service';

const primaryColor = '#26C485'; // Green color from screenshot
const secondaryColor = '#F0F8F4'; // Light green for backgrounds
const accentColor = '#FFB84D'; // Warm accent color
const textDarkColor = '#333333';
const textLightColor = '#666666';
const backgroundGray = '#F9F9F9';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

// Abbreviated day names for different languages
const dayNamesShort = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  vi: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
};

interface TrackerItem {
  id: string;
  date: string;
  time: string | null;
  img: string;
}

export default function TrackerScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { accessToken, isAuthenticated } = useAuth();

  // Calculate the start and end of the current week
  const currentDay = moment();
  const startOfWeek = currentDay.clone().startOf('week');
  const endOfWeek = currentDay.clone().endOf('week');

  const [startDate, setStartDate] = useState(startOfWeek.toDate());
  const [endDate, setEndDate] = useState(endOfWeek.toDate());
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'thisWeek' | 'thisMonth' | null>('thisWeek');

  // Date picker states
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());
  const [datePickerMode, setDatePickerMode] = useState<'start' | 'end'>('start');

  // Use React Query to fetch tracker data
  const {
    data: trackerItems = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<TrackerItem[]>(
    [
      'trackersByDateRange',
      moment(startDate).format('YYYY-MM-DD'),
      moment(endDate).format('YYYY-MM-DD'),
    ],
    async () => {
      const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
      const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

      try {
        const response = await TrackerService.getTracklistByRange({
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        });

        return response;
      } catch (error) {
        console.error('Error fetching tracker data:', error);
        throw error;
      }
    },
    {
      enabled: isAuthenticated,
      staleTime: 1000 * 60 * 5, // 5 minutes
      keepPreviousData: true,
      onError: error => {
        console.error('Failed to load tracker data:', error);
      },
    }
  );

  const [refreshing, setRefreshing] = useState(false);

  // Group items by date
  const groupedItems = trackerItems.reduce(
    (acc, item) => {
      const dateKey = item.date;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item);
      return acc;
    },
    {} as Record<string, TrackerItem[]>
  );

  // Get sorted dates keys for sections
  const sortedDates = Object.keys(groupedItems).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  // Handle calendar navigation
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => prev.clone().subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => prev.clone().add(1, 'month'));
  };

  // Reset temporary selections when opening modal
  useEffect(() => {
    if (showCalendarModal) {
      setSelectedStartDate(startDate);
      setSelectedEndDate(endDate);
      setCurrentMonth(moment(startDate));

      // Set active tab based on current date range
      const today = moment().startOf('day');
      if (moment(startDate).isSame(today, 'day') && moment(endDate).isSame(today, 'day')) {
        setActiveTab('today');
      } else if (
        moment(startDate).isSame(startOfWeek, 'day') &&
        moment(endDate).isSame(endOfWeek, 'day')
      ) {
        setActiveTab('thisWeek');
      } else if (
        moment(startDate).isSame(today.clone().startOf('month'), 'day') &&
        moment(endDate).isSame(today.clone().endOf('month'), 'day')
      ) {
        setActiveTab('thisMonth');
      } else {
        setActiveTab(null);
      }
    }
  }, [showCalendarModal]);

  // Open date picker
  const showDatePicker = (mode: 'start' | 'end') => {
    if (mode === 'start') {
      setPickerDate(selectedStartDate || new Date());
      setStartDatePickerVisible(true);
    } else {
      setPickerDate(selectedEndDate || new Date());
      setEndDatePickerVisible(true);
    }
    setDatePickerMode(mode);
  };

  // Handle date selections from both calendar and date picker
  const handleDateSelect = (date: Date) => {
    const momentDate = moment(date);

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // First selection or new selection
      setSelectedStartDate(date);
      setSelectedEndDate(null);
      setActiveTab(null);
    } else {
      // Second selection
      if (momentDate.isBefore(selectedStartDate)) {
        setSelectedStartDate(date);
        setSelectedEndDate(selectedStartDate);
      } else {
        setSelectedEndDate(date);
      }
      setActiveTab(null);
    }
  };

  // Handle date picker confirmation
  const handleConfirm = (date: Date) => {
    if (datePickerMode === 'start') {
      setSelectedStartDate(date);
      setStartDatePickerVisible(false);

      // If end date is before start date, reset it
      if (selectedEndDate && moment(date).isAfter(selectedEndDate)) {
        setSelectedEndDate(null);
      }
    } else {
      setSelectedEndDate(date);
      setEndDatePickerVisible(false);
    }
    setActiveTab(null);
  };

  // Apply selected date range
  const applyDateRange = () => {
    if (selectedStartDate && selectedEndDate) {
      setStartDate(selectedStartDate);
      setEndDate(selectedEndDate);
      setShowCalendarModal(false);
    } else if (selectedStartDate) {
      setStartDate(selectedStartDate);
      setEndDate(selectedStartDate);
      setShowCalendarModal(false);
    }
  };

  // Handle tab selections
  const handleTabSelect = (tab: 'today' | 'thisWeek' | 'thisMonth') => {
    setActiveTab(tab);
    const today = moment();

    switch (tab) {
      case 'today':
        setSelectedStartDate(today.toDate());
        setSelectedEndDate(today.toDate());
        setCurrentMonth(today);
        break;
      case 'thisWeek':
        setSelectedStartDate(today.clone().startOf('week').toDate());
        setSelectedEndDate(today.clone().endOf('week').toDate());
        setCurrentMonth(today);
        break;
      case 'thisMonth':
        setSelectedStartDate(today.clone().startOf('month').toDate());
        setSelectedEndDate(today.clone().endOf('month').toDate());
        setCurrentMonth(today);
        break;
    }
  };

  // Check if a date is within the selected range
  const isDateInRange = (date: Date) => {
    if (!selectedStartDate) return false;
    if (!selectedEndDate) return moment(date).isSame(selectedStartDate, 'day');

    return (
      moment(date).isSameOrAfter(selectedStartDate, 'day') &&
      moment(date).isSameOrBefore(selectedEndDate, 'day')
    );
  };

  // Check if a date is the start of range
  const isStartDate = (date: Date) => {
    return selectedStartDate && moment(date).isSame(selectedStartDate, 'day');
  };

  // Check if a date is the end of range
  const isEndDate = (date: Date) => {
    return selectedEndDate && moment(date).isSame(selectedEndDate, 'day');
  };

  // Generate calendar days
  const renderCalendarDays = () => {
    const monthStart = currentMonth.clone().startOf('month');
    const monthEnd = currentMonth.clone().endOf('month');
    const startDay = monthStart.clone().startOf('week');
    const endDay = monthEnd.clone().endOf('week');

    const rows = [];
    let days = [];
    let day = startDay.clone();

    // Use abbreviated day names based on current locale
    const currentLocale = t('locale', 'vi');
    const useVietnamese = currentLocale === 'vi';
    const dayHeaders = (useVietnamese ? dayNamesShort.vi : dayNamesShort.en).map((dayName, idx) => (
      <Text key={idx} style={styles.dayHeader}>
        {dayName}
      </Text>
    ));

    rows.push(
      <View key="header" style={styles.weekRow}>
        {dayHeaders}
      </View>
    );

    // Generate calendar days
    while (day.isSameOrBefore(endDay, 'day')) {
      for (let i = 0; i < 7; i++) {
        const clonedDay = day.clone();
        const dateObj = clonedDay.toDate();
        const isCurrentMonth = clonedDay.month() === currentMonth.month();

        const isSelected = isDateInRange(dateObj);
        const isStart = isStartDate(dateObj);
        const isEnd = isEndDate(dateObj);

        // Create style based on conditions
        let dayStyle = { ...styles.day };
        let textStyle = { ...styles.dayText };

        if (!isCurrentMonth) {
          textStyle = { ...textStyle, ...styles.outsideMonthText };
        }

        if (isSelected) {
          dayStyle = { ...dayStyle, ...styles.selectedDay };
          textStyle = { ...textStyle, ...styles.selectedDayText };
        }

        if (isStart) {
          dayStyle = { ...dayStyle, ...styles.startDay };
        }

        if (isEnd) {
          dayStyle = { ...dayStyle, ...styles.endDay };
        }

        if (isSelected && !isStart && !isEnd) {
          dayStyle = { ...dayStyle, ...styles.inRangeDay };
        }

        // Today indicator
        const isToday = clonedDay.isSame(moment(), 'day');
        if (isToday && !isSelected) {
          const todayStyle = { color: primaryColor, fontWeight: 'bold' as const };
          textStyle = { ...textStyle, ...todayStyle };
        }

        days.push(
          <TouchableOpacity
            key={clonedDay.format('YYYY-MM-DD')}
            style={dayStyle}
            onPress={() => isCurrentMonth && handleDateSelect(dateObj)}
          >
            <Text style={textStyle}>{clonedDay.format('D')}</Text>
          </TouchableOpacity>
        );

        day.add(1, 'day');
      }

      rows.push(
        <View key={day.format('YYYY-MM-DD')} style={styles.weekRow}>
          {days}
        </View>
      );
      days = [];
    }

    return rows;
  };

  // Render tracker item skeleton
  const renderTrackerItemSkeleton = () => {
    return Array(3)
      .fill(0)
      .map((_, index) => (
        <View key={`skeleton-${index}`} style={styles.trackerItem}>
          <View style={styles.trackerImageContainer}>
            <ShimmerPlaceHolder
              style={styles.trackerImage}
              shimmerColors={['#f3f3f3', '#e8e8e8', '#f3f3f3']}
            />
          </View>
          <View style={styles.trackerDetailContainer}>
            <View style={styles.skeletonLeft}>
              <View style={styles.dateIndicatorSkeleton}>
                <ShimmerPlaceHolder
                  style={{ width: 30, height: 16, borderRadius: 4 }}
                  shimmerColors={['#f3f3f3', '#e8e8e8', '#f3f3f3']}
                />
                <ShimmerPlaceHolder
                  style={{ width: 20, height: 24, borderRadius: 4, marginTop: 4 }}
                  shimmerColors={['#f3f3f3', '#e8e8e8', '#f3f3f3']}
                />
              </View>
            </View>
            <View style={styles.skeletonRight}>
              <ShimmerPlaceHolder
                style={{ width: 120, height: 16, borderRadius: 4 }}
                shimmerColors={['#f3f3f3', '#e8e8e8', '#f3f3f3']}
              />
              <ShimmerPlaceHolder
                style={{ width: 80, height: 14, borderRadius: 4, marginTop: 8 }}
                shimmerColors={['#f3f3f3', '#e8e8e8', '#f3f3f3']}
              />
            </View>
          </View>
        </View>
      ));
  };

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'EEEE, dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  // Get day of week and day number from date
  const getDayInfo = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return {
        dayOfWeek: format(date, 'EEE', { locale: vi }),
        dayNumber: format(date, 'dd'),
      };
    } catch (error) {
      return { dayOfWeek: '--', dayNumber: '--' };
    }
  };

  // Render tracker item
  const renderTrackerItem = ({ item }: { item: TrackerItem }) => {
    const { dayOfWeek, dayNumber } = getDayInfo(item.date);

    return (
      <TouchableOpacity
        style={styles.trackerItem}
        activeOpacity={0.7}
        onPress={() => {
          // Navigate to detail or handle press
          router.push(`../(tracker)/detail?trackerId=${item.id}`);
        }}
      >
        <View style={styles.trackerImageContainer}>
          <Image source={{ uri: item.img }} style={styles.trackerImage} resizeMode="cover" />
        </View>
        <View style={styles.trackerDetailContainer}>
          <View style={styles.leftSection}>
            <View style={styles.dateIndicator}>
              <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
              <Text style={styles.dayNumber}>{dayNumber}</Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <View style={styles.locationContainer}>
              <LucideCamera size={16} color={textLightColor} style={{ marginRight: 5 }} />
              {item.time && <Text style={styles.trackerTime}>{item.time}</Text>}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Format month and year for display
  const formatMonthYear = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      // Format month and year in Vietnamese with capitalized first letter
      const monthYear = format(date, 'LLLL yyyy', { locale: vi });
      return monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
    } catch (error) {
      return dateString;
    }
  };

  // Render section header - modified to show month format
  const renderSectionHeader = (date: string, isNewMonth: boolean) => {
    if (isNewMonth) {
      return (
        <View style={styles.sectionHeader}>
          <View style={styles.monthYearContainer}>
            <Text style={styles.monthYearText}>{formatMonthYear(date)}</Text>
          </View>
        </View>
      );
    }
    return null;
  };

  // Render empty state
  const renderEmptyState = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <LucideCamera size={80} color="#cccccc" />
        <Text style={styles.emptyText}>
          {t('No data in this time period', 'Không có dữ liệu trong khoảng thời gian này')}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <LucideArrowLeft size={24} color={textDarkColor} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('Tracker', 'Hành trình')}</Text>
        {startDate && endDate ? (
          <TouchableOpacity
            style={styles.calendarButton}
            onPress={() => setShowCalendarModal(true)}
          >
            <LucideCalendar size={22} color={primaryColor} />
            <Text style={styles.dateRangeText}>
              {moment(startDate).format('DD.MM')}
              {!moment(startDate).isSame(endDate, 'day') && ` - ${moment(endDate).format('DD.MM')}`}
            </Text>
            <LucideChevronDown size={14} color={primaryColor} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.calendarButton}
            onPress={() => setShowCalendarModal(true)}
          >
            <LucideCalendar size={22} color={primaryColor} />
          </TouchableOpacity>
        )}
      </View>

      {/* Main Content */}
      {isLoading ? (
        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {renderTrackerItemSkeleton()}
        </ScrollView>
      ) : trackerItems.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[primaryColor]}
              tintColor={primaryColor}
            />
          }
        >
          <View>
            {sortedDates.map((date, index) => {
              const currentMonth = new Date(date).getMonth();
              const previousDate = index > 0 ? sortedDates[index - 1] : null;
              const previousMonth = previousDate ? new Date(previousDate).getMonth() : null;
              const isNewMonth = index === 0 || currentMonth !== previousMonth;
              return <View key={date}>{renderSectionHeader(date, isNewMonth)}</View>;
            })}
          </View>
          <View style={{ flex: 1, flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
            {sortedDates.map((date, index, array) => {
              const even = array.length % 2 === 0;
              return (
                <View key={date} style={{ width: !even && index === 0 ? '100%' : '48.5%' }}>
                  {groupedItems[date].map(item => (
                    <View key={item.id}>{renderTrackerItem({ item })}</View>
                  ))}
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Calendar Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showCalendarModal}
        onRequestClose={() => setShowCalendarModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowCalendarModal(false)}>
                <Text style={styles.closeButton}>{t('Close', 'Đóng')}</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{t('Select Dates', 'Chọn ngày')}</Text>
              <TouchableOpacity onPress={applyDateRange}>
                <Text style={styles.applyButton}>{t('Apply', 'Áp dụng')}</Text>
              </TouchableOpacity>
            </View>

            {/* Tab Buttons */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'today' && styles.activeTabButton]}
                onPress={() => handleTabSelect('today')}
              >
                <Text style={[styles.tabButtonText, activeTab === 'today' && styles.activeTabText]}>
                  {t('Today', 'Hôm nay')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'thisWeek' && styles.activeTabButton]}
                onPress={() => handleTabSelect('thisWeek')}
              >
                <Text
                  style={[styles.tabButtonText, activeTab === 'thisWeek' && styles.activeTabText]}
                >
                  {t('This week', 'Tuần này')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'thisMonth' && styles.activeTabButton]}
                onPress={() => handleTabSelect('thisMonth')}
              >
                <Text
                  style={[styles.tabButtonText, activeTab === 'thisMonth' && styles.activeTabText]}
                >
                  {t('This month', 'Tháng này')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Month Navigation */}
            <View style={styles.monthNavigation}>
              <TouchableOpacity style={styles.navButton} onPress={goToPreviousMonth}>
                <LucideChevronLeft size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.monthYearTitle}>{currentMonth.format('MMMM YYYY')}</Text>
              <TouchableOpacity style={styles.navButton} onPress={goToNextMonth}>
                <LucideChevronRight size={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* Calendar */}
            <View style={styles.calendarContainer}>{renderCalendarDays()}</View>

            {/* Date Range Selection with DatePicker */}
            <View style={styles.datePickerSelectionContainer}>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => showDatePicker('start')}
              >
                <Text style={styles.datePickerLabel}>{t('Start Date', 'Ngày bắt đầu')}</Text>
                <Text style={styles.datePickerValue}>
                  {selectedStartDate
                    ? moment(selectedStartDate).format('DD/MM/YYYY')
                    : '--/--/----'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => showDatePicker('end')}
                disabled={!selectedStartDate}
              >
                <Text style={styles.datePickerLabel}>{t('End Date', 'Ngày kết thúc')}</Text>
                <Text style={[styles.datePickerValue, !selectedStartDate && styles.disabledText]}>
                  {selectedEndDate ? moment(selectedEndDate).format('DD/MM/YYYY') : '--/--/----'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* DateTimePicker Modals */}
            <DateTimePickerModal
              isVisible={isStartDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={() => setStartDatePickerVisible(false)}
              date={selectedStartDate || new Date()}
              maximumDate={new Date(2030, 12, 31)}
              minimumDate={new Date(2020, 0, 1)}
            />

            <DateTimePickerModal
              isVisible={isEndDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={() => setEndDatePickerVisible(false)}
              date={selectedEndDate || selectedStartDate || new Date()}
              maximumDate={new Date(2030, 12, 31)}
              minimumDate={selectedStartDate || new Date(2020, 0, 1)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const DAY_SIZE = width / 8;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: variables.scale(16),
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  title: {
    fontSize: variables.scale(34),
    color: textDarkColor,
    fontWeight: 'bold',
    marginLeft: variables.scale(10),
    fontFamily: commonColor.fontFamilyBold,
    flex: 1,
  },
  backButton: {
    padding: variables.scale(16),
  },
  calendarButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: variables.scale(8),
    padding: variables.scale(16),
    backgroundColor: secondaryColor,
    borderRadius: 20,
    marginRight: 10,
  },
  dateRangeText: {
    fontSize: variables.scale(30),
    fontFamily: commonColor.fontFamilyMedium,
    color: primaryColor,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxHeight: '90%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 16,
    color: '#666',
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: textDarkColor,
  },
  applyButton: {
    fontSize: 16,
    color: primaryColor,
    fontWeight: 'bold',
    padding: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#f2f2f2',
    borderRadius: 30,
    padding: 5,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  activeTabButton: {
    backgroundColor: primaryColor,
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButtonText: {
    color: textLightColor,
    fontWeight: '500',
    fontSize: 14,
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  navButton: {
    padding: 8,
    backgroundColor: backgroundGray,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthYearTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: textDarkColor,
  },
  calendarContainer: {
    marginTop: variables.scale(20),
    padding: variables.scale(8),
    backgroundColor: '#FFFFFF',
    borderRadius: variables.scale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 1,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayHeader: {
    width: DAY_SIZE,
    textAlign: 'center',
    fontWeight: 'bold',
    color: textLightColor,
    marginBottom: variables.scale(8),
    marginTop: variables.scale(30),
    fontSize: 14,
  },
  day: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 16,
    color: textDarkColor,
  },
  outsideMonthText: {
    color: '#ccc',
  },
  selectedDay: {
    backgroundColor: primaryColor,
  },
  startDay: {
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
  },
  endDay: {
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  inRangeDay: {
    backgroundColor: `${primaryColor}30`,
    borderRadius: 0,
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  datePickerSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: variables.scale(15),
    paddingTop: variables.scale(15),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  datePickerButton: {
    flex: 1,
    padding: variables.scale(20),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: variables.scale(24),
    marginHorizontal: variables.scale(50),
    backgroundColor: '#FFFFFF',
  },
  datePickerLabel: {
    fontSize: 14,
    color: textLightColor,
    marginBottom: 5,
  },
  datePickerValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: primaryColor,
  },
  disabledText: {
    color: '#ccc',
  },

  // Content Styles
  contentContainer: {
    flex: 1,
    backgroundColor: backgroundGray,
  },
  scrollContentContainer: {
    paddingHorizontal: variables.scale(20),
  },
  sectionHeader: {
    backgroundColor: 'transparent',
    marginBottom: variables.scale(20),
    marginTop: variables.scale(20),
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: textDarkColor,
    textTransform: 'capitalize',
  },
  monthYearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryColor,
    fontFamily: commonColor.fontFamilyBold,
    textTransform: 'capitalize',
    marginRight: 10,
  },
  trackerItem: {
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: commonColor.ColorWhite,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: variables.scale(8),
    elevation: 3,
    overflow: 'hidden',
  },
  trackerImageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
  },
  trackerImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  trackerDetailContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateIndicator: {
    alignItems: 'center',
    backgroundColor: secondaryColor,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    minWidth: 50,
  },
  dateIndicatorSkeleton: {
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    minWidth: 50,
  },
  dayOfWeek: {
    fontSize: 12,
    color: primaryColor,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryColor,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: backgroundGray,
    paddingHorizontal: variables.scale(20),
    paddingVertical: variables.scale(10),
    borderRadius: variables.scale(20),
  },
  locationText: {
    fontSize: 14,
    color: textLightColor,
  },
  trackerDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: textDarkColor,
  },
  trackerTime: {
    fontSize: 14,
    color: 'black',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: backgroundGray,
  },
  emptyText: {
    fontSize: 16,
    color: textLightColor,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: primaryColor,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  skeletonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonRight: {
    alignItems: 'flex-end',
  },
});
