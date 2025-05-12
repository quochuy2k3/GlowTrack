import { useAuth } from '@/contexts/auth';
import { DaySchema, SessionSchema, StepSchema, UserRoutineResponse } from '@/models/routine';
import { services, useServices } from '@/services';
import commonColor from '@/theme/commonColor';
import variables from '@/theme/commonColor';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useIsFocused } from '@react-navigation/native';
import { Pencil, Trash } from '@tamagui/lucide-icons';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Animated, { FadeIn, FadeOut, Layout, SlideInRight } from 'react-native-reanimated';
import { useQuery } from 'react-query';
import { XStack, YStack } from 'tamagui';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const COLORS = {
  // Màu chính từ logo GlowTrack
  coral: '#FF9F87', // Màu cam hồng từ logo GlowTrack
  mint: '#80CBC4', // Màu bạc hà/xanh ngọc từ logo

  // Màu nền và chính
  background: '#FFFFFF', // Nền trắng
  cardBg: '#FFFFFF', // Nền thẻ

  // Màu chủ đạo dành cho các thành phần chính
  primary: '#E6BBFA', // Tím nhạt như trong Morning Routine
  primaryLight: '#F3E5F5', // Tím rất nhạt
  primaryDark: '#BA68C8', // Tím đậm

  // Màu bổ sung
  secondary: '#A5D6A7', // Xanh lá nhạt
  secondaryLight: '#E8F5E9', // Xanh lá rất nhạt
  accent: '#FFAB91', // Cam hồng nhạt (thứ cấp)
  accentLight: '#FFECB3', // Vàng nhạt

  // Màu chức năng
  text: '#5D4037', // Nâu đậm cho text chính
  textLight: '#8D6E63', // Nâu nhạt cho text phụ
  danger: '#EF5350', // Đỏ cho cảnh báo/xóa
  dangerLight: '#FFCDD2', // Đỏ nhạt
  shadow: 'rgba(0, 0, 0, 0.13)', // Bóng mờ

  // Màu bổ sung thêm
  timeSlot: '#B2EBF2', // Xanh nước nhạt cho time slot
  addButton: '#A5D6A7', // Xanh lá nhạt cho nút Add
  stepBg: '#EEEEEE', // Xám nhạt cho background của step
  stepCircle: '#FF9F87', // Màu cam hồng cho bước
};

const RoutineScreen = () => {
  const services = useServices();
  const auth = useAuth();
  const {
    refetch: refetchUserRoutine,
    data: userRoutine,
    isLoading: isLoadingUserRoutine,
  } = useQuery({
    queryKey: ['userRoutine'],
    queryFn: () => services.UserRoutineService.getUserRoutine(),
    enabled: auth.isAuthenticated,
  });
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(
    today.toLocaleDateString('en-US', { weekday: 'long' })
  );
  const [selectedSession, setSelectedSession] = useState(0);
  const [dataToProcess, setDataToProcess] = useState<UserRoutineResponse | null>(
    userRoutine ?? null
  );
  const [isAddStepModalVisible, setIsAddStepModalVisible] = useState(false);
  const [newStepName, setNewStepName] = useState('');
  const [activeSessionIndex, setActiveSessionIndex] = useState(0);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [deleteType, setDeleteType] = useState<'step' | 'session'>('step');
  const [deleteSessionIndex, setDeleteSessionIndex] = useState(0);
  const [deleteStepIndex, setDeleteStepIndex] = useState(0);
  const [deleteStepDetails, setDeleteStepDetails] = useState<{ name: string; order: number }>({
    name: '',
    order: 0,
  });
  const [deleteSessionTime, setDeleteSessionTime] = useState<string>('');
  const [isAddSessionModalVisible, setIsAddSessionModalVisible] = useState(false);
  const [newSessionTime, setNewSessionTime] = useState(new Date());
  const sessionListRef = React.useRef<FlatList>(null);
  const [scrollToIndex, setScrollToIndex] = useState<number | null>(null);
  const isFocused = useIsFocused();
  const [resetKey, setResetKey] = useState(0);

  // Animation values
  const daySelectionScale = useSharedValue(1);

  // Thêm các state mới cho modal đổi tên
  const [isEditNameModalVisible, setIsEditNameModalVisible] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [isNameError, setIsNameError] = useState(false);

  const renderDay = (dayName: string) => (
    <Animated.View
      key={dayName}
      entering={FadeIn.duration(300).delay(daysOfWeek.indexOf(dayName) * 30)}
      layout={Layout.springify()}
    >
      <TouchableOpacity
        onPress={() => {
          daySelectionScale.value = withSpring(1.1, {}, () => {
            daySelectionScale.value = withSpring(1);
          });
          setSelectedDay(dayName);
        }}
        style={[styles.dayButton, dayName === selectedDay && styles.selectedDayButton]}
      >
        <Animated.Text style={[styles.dayText, dayName === selectedDay && styles.selectedDayText]}>
          {dayName}
        </Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const [expandedSessions, setExpandedSessions] = useState<boolean[]>([]);
  const [isChangeTimeVisible, setIsChangeTimeVisible] = useState<boolean[]>([]);
  const [sessionsOfSelectedDay, setSessionsOfSelectedDay] = useState<SessionSchema[]>([]);
  const [sessionUpdateToFetch, setSessionUpdateToFetch] = useState<SessionSchema[]>([]);
  useEffect(() => {
    if (dataToProcess) {
      const sessionsFromDay = dataToProcess.days.find(
        day => day.day_of_week === selectedDay
      )?.sessions;
      // Create a fresh deep copy of sessions to ensure complete isolation
      const sessionsCopy = sessionsFromDay ? JSON.parse(JSON.stringify(sessionsFromDay)) : [];

      setSessionsOfSelectedDay(sessionsCopy);

      // Reset expanded arrays completely based on new sessions array
      setExpandedSessions(new Array(sessionsCopy.length).fill(false));
      setIsChangeTimeVisible(new Array(sessionsCopy.length).fill(false));
    }
  }, [selectedDay, dataToProcess]);
  useEffect(() => {
    if (userRoutine) {
      // Create a deep copy of userRoutine to avoid reference issues
      const deepCopy = JSON.parse(JSON.stringify(userRoutine));
      setDataToProcess(deepCopy);
    } else {
      setDataToProcess(null);
    }
  }, [userRoutine, selectedDay, isFocused]);

  useEffect(() => {
    refetchUserRoutine();
    setSelectedDay(today.toLocaleDateString('en-US', { weekday: 'long' }));
  }, [isFocused]);

  const fetchUpdateSession = (sessions: SessionSchema[]) => {
    const deepCopy = JSON.parse(JSON.stringify(sessions));
    const updatedSessions = deepCopy.map((session: SessionSchema) => ({
      ...session,
      status: 'pending',
    }));
    const dayToUpdate: DaySchema = {
      day_of_week: selectedDay,
      sessions: updatedSessions,
    };
    services.UserRoutineService.updateDayofRoutine(dayToUpdate);

    // console.log('dayToUpdate', dayToUpdate);
  };
  // Add session handler
  const handleAddSession = () => {
    setNewSessionTime(new Date());
    setIsAddSessionModalVisible(true);
  };

  // Modified Delete session handler with confirmation
  const confirmDeleteSession = (sessionIndex: number, session: SessionSchema) => {
    setDeleteSessionIndex(sessionIndex);
    setDeleteSessionTime(session.time);
    setDeleteType('session');
    setIsDeleteConfirmVisible(true);
  };

  const handleDeleteSession = () => {
    const sessionIndexToDelete = sessionsOfSelectedDay.findIndex(
      session => session.time === deleteSessionTime
    );

    if (sessionIndexToDelete !== -1) {
      // Create a completely new copy of sessionsOfSelectedDay
      const updatedSessions = [...sessionsOfSelectedDay];
      updatedSessions.splice(sessionIndexToDelete, 1);

      // Update the local state for this day's sessions
      setSessionsOfSelectedDay(updatedSessions);

      fetchUpdateSession(updatedSessions);

      // Create a completely new expanded sessions array
      const updatedExpandedSessions = new Array(updatedSessions.length).fill(false);
      setExpandedSessions(updatedExpandedSessions);

      // Update dataToProcess with a completely new copy
      if (dataToProcess) {
        const newDataToProcess = JSON.parse(JSON.stringify(dataToProcess));
        const dayIndex = newDataToProcess.days.findIndex(day => day.day_of_week === selectedDay);
        if (dayIndex !== -1) {
          newDataToProcess.days[dayIndex].sessions = updatedSessions;
          setDataToProcess(newDataToProcess);
        }
      }
    }

    setIsDeleteConfirmVisible(false);
  };

  // Modified Add step handler
  const handleAddStep = (sessionIndex: number) => {
    setActiveSessionIndex(sessionIndex);
    setNewStepName('');
    setIsAddStepModalVisible(true);
  };

  const handleAddStepConfirm = () => {
    if (newStepName.trim()) {
      const updatedSessions = [...sessionsOfSelectedDay];
      const currentSteps = updatedSessions[activeSessionIndex].steps;

      // Find the highest step_order from existing steps
      const highestOrder = currentSteps.reduce(
        (maxOrder, step) => (step.step_order > maxOrder ? step.step_order : maxOrder),
        0
      );

      // Add new step with incremented order
      updatedSessions[activeSessionIndex].steps.push({
        step_name: newStepName.trim(),
        step_order: highestOrder + 1,
      } as StepSchema);

      setSessionsOfSelectedDay(updatedSessions);
      fetchUpdateSession(updatedSessions);
    }
    setIsAddStepModalVisible(false);
  };

  // Modified Delete step handler with confirmation and reordering
  const confirmDeleteStep = (sessionIndex: number, stepIndex: number, stepItem: StepSchema) => {
    setDeleteSessionIndex(sessionIndex);
    setDeleteStepIndex(stepIndex);
    setDeleteStepDetails({
      name: stepItem.step_name,
      order: stepItem.step_order,
    });
    setDeleteType('step');
    setIsDeleteConfirmVisible(true);
  };

  const handleDeleteStep = () => {
    const updatedSessions = [...sessionsOfSelectedDay];

    if (deleteSessionIndex >= 0 && updatedSessions[deleteSessionIndex]) {
      const sessionSteps = updatedSessions[deleteSessionIndex].steps;

      // Find the exact step by matching both name and order
      const stepToDeleteIndex = sessionSteps.findIndex(
        step =>
          step.step_name === deleteStepDetails.name && step.step_order === deleteStepDetails.order
      );

      // Only delete if we found the matching step
      if (stepToDeleteIndex !== -1) {
        // Remove the step
        updatedSessions[deleteSessionIndex].steps.splice(stepToDeleteIndex, 1);

        // Reorder the remaining steps
        updatedSessions[deleteSessionIndex].steps = updatedSessions[deleteSessionIndex].steps.map(
          (step, index) => ({
            ...step,
            step_order: index + 1,
          })
        );

        setSessionsOfSelectedDay(updatedSessions);
        fetchUpdateSession(updatedSessions);
      }
    }
    setIsDeleteConfirmVisible(false);
  };

  // Toggle session expand handler
  const toggleSession = (index: number) => {
    const updatedExpandedSessions = [...expandedSessions];
    updatedExpandedSessions[index] = !updatedExpandedSessions[index];
    setExpandedSessions(updatedExpandedSessions);
  };
  const toggleChangeTime = (sessionIndex: number) => {
    const updatedIsChangeTimeVisible = [...isChangeTimeVisible];
    updatedIsChangeTimeVisible[sessionIndex] = !updatedIsChangeTimeVisible[sessionIndex];

    // When opening the time picker, initialize with the session's current time
    if (!isChangeTimeVisible[sessionIndex] && sessionsOfSelectedDay[sessionIndex]) {
      // Parse the session time to create a Date object
      try {
        const sessionTime = sessionsOfSelectedDay[sessionIndex].time;
        const timeComponents = sessionTime.match(/(\d+):(\d+)\s*([AP]M)/i);

        if (timeComponents) {
          const [_, hours, minutes, period] = timeComponents;
          const date = new Date();

          // Set hours (12-hour format to 24-hour)
          let hourValue = parseInt(hours, 10);
          if (period.toUpperCase() === 'PM' && hourValue < 12) {
            hourValue += 12;
          } else if (period.toUpperCase() === 'AM' && hourValue === 12) {
            hourValue = 0;
          }

          date.setHours(hourValue, parseInt(minutes, 10), 0, 0);
          setNewSessionTime(date);
        }
      } catch (error) {
        console.log('Error parsing time:', error);
        setNewSessionTime(new Date());
      }
    }

    setIsChangeTimeVisible(updatedIsChangeTimeVisible);
  };

  const renderStep = (
    { item, drag, index }: RenderItemParams<StepSchema>,
    sessionIndex: number
  ) => (
    <Animated.View
      entering={FadeIn.duration(150).delay(index * 20)}
      exiting={FadeOut.duration(100)}
      layout={Layout.springify()}
    >
      <TouchableOpacity
        style={[
          styles.step,
          { backgroundColor: 'rgba(39, 39, 39, 0.23)', borderRadius: variables.scale(20) },
        ]}
        onLongPress={drag}
      >
        <View style={[styles.stepCircle]}>
          <Text style={styles.stepNumber}>{item.step_order}</Text>
        </View>
        <Text style={styles.stepName}>{item.step_name}</Text>
        <TouchableOpacity
          style={styles.deleteStepButton}
          onPress={() => confirmDeleteStep(sessionIndex, index, item)}
        >
          <Trash color={COLORS.danger} size={20} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderSession = (session: any, sessionIndex: number) => (
    <Animated.View
      style={styles.swipeContainer}
      entering={SlideInRight.duration(200).delay(sessionIndex * 50)}
      layout={Layout.springify()}
    >
      <Swipeable
        renderRightActions={() => (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => confirmDeleteSession(sessionIndex, session)}
          >
            <Animated.View entering={FadeIn.duration(120)}>
              <Trash color={COLORS.danger} size={30} />
            </Animated.View>
          </TouchableOpacity>
        )}
      >
        <View style={styles.sessionContentContainer}>
          <TouchableOpacity
            style={styles.sessionTimeButton}
            onPress={() => toggleSession(sessionIndex)}
          >
            {expandedSessions[sessionIndex] ? (
              <Animated.View style={styles.changeTimeContainer} entering={FadeIn.duration(150)}>
                <TouchableOpacity
                  style={styles.changeTimeButton}
                  onPress={() => toggleChangeTime(sessionIndex)}
                >
                  {isChangeTimeVisible[sessionIndex] ? (
                    <Animated.View
                      style={styles.timePickerContainer}
                      entering={FadeIn.duration(150)}
                    >
                      <DateTimePicker
                        textColor={COLORS.text}
                        value={newSessionTime}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedTime) => {
                          if (selectedTime) setNewSessionTime(selectedTime);
                        }}
                      />
                      <TouchableOpacity
                        style={styles.applyTimeButton}
                        onPress={() => {
                          handleApplyTime(sessionIndex, newSessionTime);
                        }}
                      >
                        <Text>Apply</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  ) : (
                    <Animated.View
                      style={styles.sessionTimeTextContainer}
                      entering={FadeIn.duration(150)}
                    >
                      <Text>{session.time}</Text>
                    </Animated.View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <Animated.Text style={styles.sessionTimeText} layout={Layout.springify()}>
                Steps at {session.time}
              </Animated.Text>
            )}
          </TouchableOpacity>

          <Animated.View
            layout={Layout.springify()}
            style={[
              styles.expandedSession,
              {
                height: expandedSessions[sessionIndex] ? 'auto' : 0,
                opacity: expandedSessions[sessionIndex] ? 1 : 0,
              },
            ]}
          >
            <View style={styles.styleDraggableFlatList}>
              <DraggableFlatList
                data={session.steps}
                style={styles.draggableFlatList}
                renderItem={props =>
                  renderStep(props as RenderItemParams<StepSchema>, sessionIndex)
                }
                keyExtractor={(item, index) => index.toString()}
                onDragEnd={({ data }) => {
                  const updatedSessions = [...sessionsOfSelectedDay];
                  // Update step_order to match the new index after dragging
                  const updatedSteps = (data as StepSchema[]).map((step, index) => ({
                    ...step,
                    step_order: index + 1,
                  }));
                  updatedSessions[sessionIndex].steps = updatedSteps;
                  setSessionsOfSelectedDay(updatedSessions as SessionSchema[]);
                  fetchUpdateSession(updatedSessions as SessionSchema[]);
                }}
                ListFooterComponent={
                  <Animated.View entering={FadeIn.duration(150)}>
                    <TouchableOpacity
                      onPress={() => handleAddStep(sessionIndex)}
                      style={styles.addStepButton}
                    >
                      <Text style={{ color: COLORS.text, fontWeight: 'bold' }}>Add Step</Text>
                    </TouchableOpacity>
                  </Animated.View>
                }
              />
            </View>
          </Animated.View>
        </View>
      </Swipeable>
    </Animated.View>
  );

  // Update handleApplyTime to use the same normalization logic
  const handleApplyTime = (sessionIndex: number, newTime: Date) => {
    // Format the time with AM/PM ensuring hours are always 2 digits
    const hours = newTime.getHours();
    const minutes = newTime.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 24h to 12h format
    const timeString = `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;

    // Normalize time format like we do when adding a session
    const normalizeTimeFormat = (time: string) => {
      if (!time) return '';

      // Convert to lowercase and remove extra spaces
      const cleanTime = time.toLowerCase().trim();

      // Extract hours, minutes, and AM/PM more flexibly
      const match = cleanTime.match(/(\d+):(\d+)\s*([ap])m/i);
      if (!match) return cleanTime;

      const hours = parseInt(match[1], 10);
      const minutes = match[2].padStart(2, '0'); // Ensure minutes has 2 digits
      const period = match[3].toLowerCase() === 'a' ? 'AM' : 'PM';

      // Return standardized format with padded hours
      return `${hours.toString().padStart(2, '0')}:${minutes} ${period}`;
    };

    const normalizedNewTime = normalizeTimeFormat(timeString);

    // Check if this time already exists in other sessions
    const timeExists = sessionsOfSelectedDay.some((session, idx) => {
      if (idx === sessionIndex) return false; // Skip the current session
      if (!session || typeof session.time !== 'string') return false;
      return normalizeTimeFormat(session.time) === normalizedNewTime;
    });

    if (timeExists) {
      alert('This time already exists. Please choose a different time.');
      return;
    }

    const updatedSessions = [...sessionsOfSelectedDay];
    updatedSessions[sessionIndex].time = normalizedNewTime;

    // Sort sessions by time
    const sortedSessions = [...updatedSessions].sort((a, b) => {
      const getMinutes = (timeStr: string) => {
        try {
          const [time, modifier] = timeStr.includes('M') ? timeStr.split(/\s+/) : [timeStr, ''];
          let [hours, minutes] = time.split(':');

          let hoursNum = parseInt(hours, 10);

          if (modifier && modifier.toUpperCase().includes('PM') && hoursNum < 12) {
            hoursNum += 12;
          } else if (modifier && modifier.toUpperCase().includes('AM') && hoursNum === 12) {
            hoursNum = 0;
          }

          return hoursNum * 60 + parseInt(minutes, 10);
        } catch (e) {
          console.log('Error parsing time:', timeStr, e);
          return 0;
        }
      };

      return getMinutes(a.time) - getMinutes(b.time);
    });

    // Update expanded sessions array to match new sorted order
    const updatedExpandedSessions = [...expandedSessions];
    const oldSessionIndex = sessionIndex;
    const newSessionIndex = sortedSessions.findIndex(s => s.time === normalizedNewTime);

    if (oldSessionIndex !== newSessionIndex) {
      // Session position changed due to sorting
      updatedExpandedSessions[newSessionIndex] = updatedExpandedSessions[oldSessionIndex];
      setScrollToIndex(newSessionIndex);
    }

    setSessionsOfSelectedDay(sortedSessions);
    setExpandedSessions(updatedExpandedSessions);
    fetchUpdateSession(sortedSessions);
    toggleChangeTime(sessionIndex);
  };

  // Add this effect to handle scrolling after render
  useEffect(() => {
    if (scrollToIndex !== null) {
      // Need to give time for the list to render
      setTimeout(() => {
        sessionListRef.current?.scrollToIndex({
          index: scrollToIndex,
          animated: true,
          viewPosition: 0.5,
        });
        setScrollToIndex(null);
      }, 100);
    }
  }, [scrollToIndex]);

  // Implement a dedicated handleAddSessionConfirm function
  const handleAddSessionConfirm = () => {
    // Format the time with AM/PM ensuring hours are always 2 digits
    const hours = newSessionTime.getHours();
    const minutes = newSessionTime.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 24h to 12h format
    const timeString = `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;

    // Normalize time format
    const normalizeTimeFormat = (time: string) => {
      if (!time) return '';
      const cleanTime = time.toLowerCase().trim();
      const match = cleanTime.match(/(\d+):(\d+)\s*([ap])m/i);
      if (!match) return cleanTime;
      const hours = parseInt(match[1], 10);
      const minutes = match[2].padStart(2, '0'); // Ensure minutes has 2 digits
      const period = match[3].toLowerCase() === 'a' ? 'AM' : 'PM';
      return `${hours.toString().padStart(2, '0')}:${minutes} ${period}`;
    };

    const normalizedNewTime = normalizeTimeFormat(timeString);

    // Check for duplicates
    const timeExists = sessionsOfSelectedDay.some(session => {
      if (!session || typeof session.time !== 'string') return false;
      return normalizeTimeFormat(session.time) === normalizedNewTime;
    });

    if (timeExists) {
      alert('This time already exists. Please choose a different time.');
      return;
    }

    // Add new session
    const updatedSessions = [
      ...sessionsOfSelectedDay,
      {
        time: normalizedNewTime,
        steps: [],
      },
    ].sort((a, b) => {
      // Use the same getMinutes function from handleApplyTime
      const getMinutes = (timeStr: string) => {
        try {
          const [time, modifier] = timeStr.includes('M') ? timeStr.split(/\s+/) : [timeStr, ''];
          let [hours, minutes] = time.split(':');
          let hoursNum = parseInt(hours, 10);
          if (modifier && modifier.toUpperCase().includes('PM') && hoursNum < 12) {
            hoursNum += 12;
          } else if (modifier && modifier.toUpperCase().includes('AM') && hoursNum === 12) {
            hoursNum = 0;
          }
          return hoursNum * 60 + parseInt(minutes, 10);
        } catch (e) {
          console.log('Error parsing time:', timeStr, e);
          return 0;
        }
      };
      return getMinutes(a.time) - getMinutes(b.time);
    });

    // Update expanded sessions array
    const updatedExpandedSessions = updatedSessions.map(
      (_, i) => i === updatedSessions.findIndex(s => s.time === normalizedNewTime)
    );

    setSessionsOfSelectedDay(updatedSessions);
    fetchUpdateSession(updatedSessions);
    setExpandedSessions(updatedExpandedSessions);

    // Update dataToProcess with a completely new copy
    if (dataToProcess) {
      const newDataToProcess = JSON.parse(JSON.stringify(dataToProcess));
      const dayIndex = newDataToProcess.days.findIndex(day => day.day_of_week === selectedDay);
      if (dayIndex !== -1) {
        newDataToProcess.days[dayIndex].sessions = JSON.parse(JSON.stringify(updatedSessions));
        setDataToProcess(newDataToProcess);
      }
    }

    // Set scroll index to the new session
    const newSessionIndex = updatedSessions.findIndex(s => s.time === normalizedNewTime);
    setScrollToIndex(newSessionIndex);

    setIsAddSessionModalVisible(false);
  };

  // Hàm để mở modal đổi tên
  const handleEditRoutineName = () => {
    setNewRoutineName(dataToProcess?.routine_name || '');
    setIsNameError(false);
    setIsEditNameModalVisible(true);
  };

  // Hàm xử lý khi submit đổi tên
  const handleUpdateRoutineName = async () => {
    if (!newRoutineName.trim()) {
      setIsNameError(true);
      return;
    }

    try {
      await services.UserRoutineService.updateRoutineName(newRoutineName);

      // Cập nhật state để hiển thị tên mới ngay lập tức
      if (dataToProcess) {
        const newDataToProcess = JSON.parse(JSON.stringify(dataToProcess));
        newDataToProcess.routine_name = newRoutineName;
        setDataToProcess(newDataToProcess);
      }

      setIsEditNameModalVisible(false);
    } catch (error) {
      console.log('Error updating routine name:', error);
    }
  };

  return (
    <GestureHandlerRootView style={{ backgroundColor: COLORS.background, flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={[{ key: 'header' }, { key: 'days' }, { key: 'sessions' }]}
          renderItem={({ item }) => {
            if (item.key === 'header') {
              return (
                <Animated.View style={styles.headerContainer} entering={FadeIn.duration(400)}>
                  <TouchableOpacity style={styles.headerButton} onPress={handleEditRoutineName}>
                    <Animated.Text
                      style={styles.headerText}
                      entering={FadeIn.duration(500).delay(150)}
                    >
                      {dataToProcess?.routine_name}
                    </Animated.Text>
                    <Animated.View
                      style={styles.editButton}
                      entering={FadeIn.duration(500).delay(200)}
                    >
                      <Pencil color={COLORS.primary} size={20} />
                    </Animated.View>
                  </TouchableOpacity>
                </Animated.View>
              );
            } else if (item.key === 'days') {
              return (
                <Animated.View
                  style={styles.dayContainer}
                  entering={FadeIn.duration(400).delay(100)}
                >
                  <YStack gap={14} my={20}>
                    <XStack gap={2} alignItems="center" justifyContent="center">
                      {daysOfWeek.slice(0, 4).map(renderDay)}
                    </XStack>
                    <XStack gap={2} alignItems="center" justifyContent="center">
                      {daysOfWeek.slice(4, 7).map(renderDay)}
                    </XStack>
                  </YStack>
                </Animated.View>
              );
            } else if (item.key === 'sessions') {
              return (
                <Animated.View
                  key={resetKey}
                  style={styles.sessionContainer}
                  entering={FadeIn.duration(400).delay(200)}
                >
                  <Animated.Text
                    style={[styles.selectedTileText, { color: COLORS.primary }]}
                    entering={FadeIn.duration(400).delay(250)}
                  >
                    Session
                  </Animated.Text>
                  <Animated.View
                    style={styles.addSessionContainer}
                    entering={FadeIn.duration(400).delay(300)}
                  >
                    <TouchableOpacity onPress={handleAddSession} style={styles.addSessionButton}>
                      <Text style={{ color: COLORS.text, fontWeight: 'bold' }}>Add Session</Text>
                    </TouchableOpacity>
                  </Animated.View>

                  <FlatList
                    ref={sessionListRef}
                    data={sessionsOfSelectedDay}
                    renderItem={({ item, index }) => renderSession(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </Animated.View>
              );
            }
            return null;
          }}
          keyExtractor={item => item.key}
        />

        {/* Add Step Modal with custom animation */}
        <Modal
          animationType="none"
          transparent={true}
          visible={isAddStepModalVisible}
          onRequestClose={() => setIsAddStepModalVisible(false)}
        >
          <Animated.View
            style={styles.modalOverlay}
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(150)}
          >
            <Animated.View
              style={styles.modalContent}
              entering={FadeIn.duration(200)
                .withInitialValues({ scale: 0.8, opacity: 0 })
                .springify()}
              exiting={FadeOut.duration(150).withInitialValues({ scale: 1, opacity: 1 })}
            >
              <Text style={styles.modalTitle}>Add New Step</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter step name"
                value={newStepName}
                onChangeText={setNewStepName}
                autoFocus
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsAddStepModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleAddStepConfirm}
                >
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </Modal>

        {/* Delete Confirmation Modal with custom animation */}
        <Modal
          animationType="none"
          transparent={true}
          visible={isDeleteConfirmVisible}
          onRequestClose={() => setIsDeleteConfirmVisible(false)}
        >
          <Animated.View
            style={styles.modalOverlay}
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(150)}
          >
            <Animated.View
              style={styles.modalContent}
              entering={FadeIn.duration(200)
                .withInitialValues({ rotate: '45deg', scale: 0.5, opacity: 0 })
                .springify()}
              exiting={FadeOut.duration(150).withInitialValues({ scale: 1, opacity: 1 })}
            >
              <Text style={styles.modalTitle}>
                {deleteType === 'step' ? 'Delete Step' : 'Delete Session'}
              </Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to delete this {deleteType}?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsDeleteConfirmVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteConfirmButton]}
                  onPress={deleteType === 'step' ? handleDeleteStep : handleDeleteSession}
                >
                  <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </Modal>

        {/* Add Session Modal with custom animation */}
        <Modal
          animationType="none"
          transparent={true}
          visible={isAddSessionModalVisible}
          onRequestClose={() => setIsAddSessionModalVisible(false)}
        >
          <Animated.View
            style={styles.modalOverlay}
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(150)}
          >
            <Animated.View
              style={styles.modalContent}
              entering={FadeIn.duration(250)
                .withInitialValues({ translateY: -100, scale: 0.7, opacity: 0 })
                .springify()}
              exiting={FadeOut.duration(150).withInitialValues({ scale: 1, opacity: 1 })}
            >
              <Text style={styles.modalTitle}>Add New Session</Text>
              <Text style={styles.modalMessage}>Select a time for your new session:</Text>

              <Animated.View
                style={styles.timePickerContainer}
                entering={FadeIn.duration(250).delay(100)}
              >
                <DateTimePicker
                  textColor={COLORS.text}
                  value={newSessionTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedTime) => {
                    if (selectedTime) setNewSessionTime(selectedTime);
                  }}
                />
              </Animated.View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsAddSessionModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleAddSessionConfirm}
                >
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </Modal>

        {/* Modal đổi tên routine */}
        <Modal
          animationType="none"
          transparent={true}
          visible={isEditNameModalVisible}
          onRequestClose={() => setIsEditNameModalVisible(false)}
        >
          <Animated.View
            style={styles.modalOverlay}
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(150)}
          >
            <Animated.View
              style={styles.modalContent}
              entering={FadeIn.duration(200)
                .withInitialValues({ scale: 0.8, opacity: 0 })
                .springify()}
              exiting={FadeOut.duration(150).withInitialValues({ scale: 1, opacity: 1 })}
            >
              <Text style={styles.modalTitle}>Edit Routine Name</Text>
              <TextInput
                style={[styles.input, isNameError && { borderColor: COLORS.danger }]}
                placeholder="Enter routine name"
                value={newRoutineName}
                onChangeText={text => {
                  setNewRoutineName(text);
                  setIsNameError(false);
                }}
                autoFocus
              />
              {isNameError && <Text style={styles.errorText}>Routine name cannot be empty</Text>}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsEditNameModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleUpdateRoutineName}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    alignItems: 'flex-start',
    marginTop: variables.scale(20),
  },
  headerButton: {
    paddingVertical: variables.scale(20),
    paddingHorizontal: variables.scale(30),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: variables.scale(48),
    fontFamily: commonColor.fontFamilyItalic,
    color: COLORS.primary,
  },
  editButton: {
    marginLeft: variables.scale(20),
  },
  dayContainer: {
    marginHorizontal: variables.scale(20),
    borderRadius: variables.scale(24),
    backgroundColor: COLORS.cardBg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: variables.scale(8),
    elevation: 4,
    marginVertical: variables.scale(30),
  },
  dayButton: {
    paddingVertical: variables.scale(16),
    paddingHorizontal: variables.scale(26),
    backgroundColor: COLORS.primaryLight,
    borderRadius: variables.scale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayButton: {
    backgroundColor: COLORS.primary,
  },
  dayText: {
    fontSize: variables.scale(24),
    fontWeight: 'bold',
    color: COLORS.text,
  },
  selectedDayText: {
    fontSize: variables.scale(24),
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addSessionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  addSessionButton: {
    flex: 1,
    marginHorizontal: variables.scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: variables.scale(20),
    backgroundColor: COLORS.addButton,
    borderRadius: variables.scale(24),
  },
  sessionContainer: {
    flexDirection: 'column',
    padding: variables.scale(20),
    marginHorizontal: variables.scale(20),
    backgroundColor: COLORS.cardBg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: variables.scale(10),
    elevation: 4,
    marginVertical: variables.scale(30),
    borderRadius: variables.scale(24),
    marginBottom: variables.scale(200),
  },
  expandedSession: {
    overflow: 'hidden',
    marginHorizontal: variables.scale(20),
    backgroundColor: COLORS.cardBg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: variables.scale(8),
    elevation: 3,
    borderRadius: variables.scale(24),
  },
  deleteButton: {
    backgroundColor: COLORS.dangerLight,
    paddingHorizontal: variables.scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  addStepButton: {
    paddingVertical: variables.scale(20),
    marginTop: variables.scale(10),
    backgroundColor: COLORS.timeSlot,
    borderRadius: variables.scale(24),
    alignItems: 'center',
  },
  selectedTileText: {
    fontSize: variables.scale(36),
    color: COLORS.primary,
    fontFamily: commonColor.fontFamilyItalic,
    marginBottom: variables.scale(20),
    marginLeft: variables.scale(20),
  },
  sessionContentContainer: {
    flexDirection: 'column',
    shadowColor: COLORS.shadow,
  },
  swipeContainer: {
    backgroundColor: COLORS.cardBg,
    marginTop: variables.scale(30),
    marginHorizontal: variables.scale(20),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: variables.scale(8),
    elevation: 3,
    borderRadius: variables.scale(24),
  },
  draggableFlatList: {},
  styleDraggableFlatList: {
    padding: variables.scale(20),
    marginHorizontal: variables.scale(10),
    marginVertical: variables.scale(10),
    backgroundColor: COLORS.cardBg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: variables.scale(8),
    elevation: 3,
    borderRadius: variables.scale(24),
    marginBottom: variables.scale(20),
  },
  stepsTileContainer: {
    alignItems: 'center',
  },
  changeTimeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePickerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: variables.scale(8),
    elevation: 3,
    borderRadius: variables.scale(24),
  },
  applyTimeButton: {
    borderRadius: variables.scale(24),
    paddingVertical: variables.scale(20),
    paddingHorizontal: variables.scale(40),
    marginRight: variables.scale(20),
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: variables.scale(8),
    elevation: 3,
    marginBottom: variables.scale(20),
  },
  changeTimeButton: {
    backgroundColor: COLORS.cardBg,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: variables.scale(8),
    elevation: 3,
    borderRadius: variables.scale(24),
  },
  sessionTimeTextContainer: {
    backgroundColor: COLORS.timeSlot,
    paddingVertical: variables.scale(20),
    paddingHorizontal: variables.scale(30),
    borderRadius: variables.scale(24),
    borderWidth: 1,
    borderColor: COLORS.mint,
  },
  sessionTimeText: {
    paddingVertical: variables.scale(20),
    fontSize: variables.scale(26),
    fontFamily: commonColor.fontFamilyItalic,
    color: COLORS.text,
  },
  sessionTimeButton: {
    paddingVertical: variables.scale(20),
    paddingHorizontal: variables.scale(30),
    borderRadius: variables.scale(24),
  },
  step: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: variables.scale(30),
    backgroundColor: COLORS.stepBg,
    borderRadius: variables.scale(20),
  },
  stepCircle: {
    marginLeft: variables.scale(20),
    width: variables.scale(40),
    height: variables.scale(40),
    borderRadius: variables.scale(20),
    marginRight: variables.scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.stepCircle,
    marginVertical: variables.scale(10),
  },
  stepNumber: {
    color: COLORS.cardBg,
    fontWeight: 'bold',
    fontSize: variables.scale(20),
  },
  stepName: {
    flex: 1,
    marginVertical: variables.scale(10),
    fontSize: variables.scale(24),
    marginRight: variables.scale(20),
    color: COLORS.text,
    fontFamily: commonColor.fontFamilyRobotoRegular,
    flexWrap: 'wrap',
  },
  deleteStepButton: {
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: variables.scale(20),
    borderTopRightRadius: variables.scale(20),
    borderBottomRightRadius: variables.scale(20),
    marginVertical: variables.scale(10),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(93, 64, 55, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: COLORS.cardBg,
    borderRadius: variables.scale(24),
    padding: variables.scale(30),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: variables.scale(40),
    fontFamily: commonColor.fontFamilyItalic,
    marginBottom: variables.scale(20),
    textAlign: 'center',
    color: COLORS.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.shadow,
    borderRadius: variables.scale(12),
    padding: variables.scale(15),
    marginBottom: variables.scale(20),
    fontSize: variables.scale(24),
    backgroundColor: COLORS.primaryLight,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: variables.scale(20),
    paddingHorizontal: variables.scale(30),
    borderRadius: variables.scale(20),
    flex: 1,
    marginHorizontal: variables.scale(10),
    marginTop: variables.scale(20),
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.shadow,
  },
  confirmButton: {
    backgroundColor: COLORS.mint,
  },
  buttonText: {
    fontSize: variables.scale(28),
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalMessage: {
    fontSize: variables.scale(18),
    marginBottom: variables.scale(20),
    textAlign: 'center',
    color: COLORS.textLight,
  },
  deleteConfirmButton: {
    backgroundColor: COLORS.danger,
  },
  deleteButtonText: {
    color: COLORS.cardBg,
  },
  errorText: {
    color: COLORS.danger,
    marginBottom: variables.scale(10),
    fontSize: variables.scale(14),
  },
});

export default RoutineScreen;
