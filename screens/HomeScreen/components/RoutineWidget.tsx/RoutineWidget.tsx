import { useAuth } from '@/contexts/auth';
import { useNotification } from '@/contexts/NoticationContext';
import { RoutineTodayResponse } from '@/models/routine';
import { useServices } from '@/services';
import commonColor from '@/theme/commonColor';
import variables from '@/theme/commonColor';
import { registerForPushNotificationsAsync } from '@/utils/registerNotification';
import { useIsFocused } from '@react-navigation/native';
import { Check } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { LucideClock } from 'lucide-react-native';
import React, { MutableRefObject, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Animated,
  Easing,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQuery } from 'react-query';

interface Step {
  step_order: number;
  step_name: string;
}

interface Session {
  time: string;
  status: 'pending' | 'done' | 'not_done';
  steps: Step[];
}
interface RoutineCardProps {
  onRefresh: MutableRefObject<() => void>;
}

const RoutineCard = ({ onRefresh }: RoutineCardProps) => {
  const isFocused = useIsFocused();
  const router = useRouter();
  const { notification, expoPushToken, error, setExpoPushToken, setError } = useNotification();
  const [routineData, setRoutineData] = useState<RoutineTodayResponse | null>(null);
  const services = useServices();
  const auth = useAuth();
  const [animatedSessions, setAnimatedSessions] = useState<{ [key: number]: Animated.Value }>({});
  const [pushToken, setPushToken] = useState<string | null>(expoPushToken);
  const [notiEnabled, setNotiEnabled] = useState<boolean | null>(null);
  const { t } = useTranslation();

  const onToggleNoti = async () => {
    try {
      if (notiEnabled) {
        // Tắt thông báo
        setNotiEnabled(false);
        setPushToken(null);
        updatePushToken('');
      } else {
        // Yêu cầu quyền thông báo và bật thông báo
        if (expoPushToken) {
          setPushToken(expoPushToken);
          setNotiEnabled(true);
          updatePushToken(expoPushToken);
        } else {
          registerForPushNotificationsAsync().then(
            token => {
              setExpoPushToken(token);
              setPushToken(token);
              setNotiEnabled(true);
              updatePushToken(token);
            },
            error => setError(error)
          );
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Không thể thực hiện hành động này');
    }
  };
  const {
    data: routineToday,
    isLoading: isLoadingRoutineDay,
    refetch: queryFn,
  } = useQuery({
    queryFn: services.UserRoutineService.getRoutineToday,
    queryKey: ['routineToday'],
    enabled: auth.isAuthenticated,
  });
  useEffect(() => {
    if (onRefresh) {
      onRefresh.current = queryFn;
    }
  }, [onRefresh, queryFn]);
  useEffect(() => {
    if (isFocused) {
      queryFn();
    }
  }, [isFocused, queryFn]);
  const toggleSession = (index: number) => {
    const animatedValue = animatedSessions[index];
    if (!animatedValue) return;

    const isExpanded = animatedValue.__getValue() === 1;
    Animated.timing(animatedValue, {
      toValue: isExpanded ? 0 : 1,
      duration: 260,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };
  useEffect(() => {
    registerForPushNotificationsAsync().then(
      token => {
        if (token) {
          setExpoPushToken(token);
          updatePushToken(token);
          setPushToken(token);
          setNotiEnabled(true);
        } else {
          setNotiEnabled(false);
          setPushToken(null);
          updatePushToken(token);
        }
      },
      error => {
        setNotiEnabled(false);
        setPushToken(null);
        setError(error);
      }
    );
  }, []);

  const updatePushToken = async (pushToken: string) => {
    await services.UserRoutineService.updatePushToken(pushToken ?? '');
  };
  useEffect(() => {
    const fetchRoutineData = async () => {
      if (!routineToday) return;
      console.log('testroutineToday', routineToday);
      const now = new Date();
      const sessions = routineToday.today.sessions;

      const parseTime = (timeStr: string): Date => {
        const match = timeStr.match(/(\d+):(\d+)\s?(AM|PM)/i);
        if (!match) return new Date(0);
        let [_, hourStr, minuteStr, period] = match;
        let hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
        if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;

        const sessionDate = new Date(now);
        sessionDate.setHours(hour, minute, 0, 0);
        return sessionDate;
      };

      let selectedIndex: number | null = null;
      let minDiff = Infinity;

      sessions.forEach((session: Session, idx: number) => {
        const sessionTime = parseTime(session.time);
        const isFuture = sessionTime >= now;
        if (session.status === 'pending' && isFuture) {
          const diff = sessionTime.getTime() - now.getTime();
          if (diff < minDiff) {
            minDiff = diff;
            selectedIndex = idx;
          }
        }
      });

      if (selectedIndex === null) {
        minDiff = Infinity;
        sessions.forEach((session: Session, idx: number) => {
          const sessionTime = parseTime(session.time);
          const diff = Math.abs(now.getTime() - sessionTime.getTime());
          if (diff < minDiff) {
            minDiff = diff;
            selectedIndex = idx;
          }
        });
      }

      setRoutineData(routineToday);

      const animState: { [key: number]: Animated.Value } = {};
      routineToday.today.sessions?.forEach((_: Session, idx: number) => {
        animState[idx] = new Animated.Value(0);
      });
      setAnimatedSessions(animState);

      if (selectedIndex !== null) {
        Animated.timing(animState[selectedIndex], {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();
      }
    };

    fetchRoutineData();
  }, [routineToday]);

  const getStatusBadgeColor = (status: Session['status']) => {
    switch (status) {
      case 'pending':
        return '#FFC107';
      case 'done':
        return '#A5D6A7';
      case 'not_done':
        return '#F44336';
    }
  };

  const getSessionBackgroundColor = (status: Session['status']) => {
    switch (status) {
      case 'pending':
        return '#FFF8E1';
      case 'done':
        return '#E8F5E9';
      case 'not_done':
        return '#FFEBEE';
    }
  };

  if (!routineData) return <Text>Loading...</Text>;

  const MarkDoneSession = async (session: Session, sessionIndex: number) => {
    try {
      // Tạo bản sao của dữ liệu hiện tại
      if (!routineData) return;

      const updatedRoutineData = { ...routineData };
      const updatedSessions = [...updatedRoutineData.today.sessions];

      // Cập nhật status thành "done"
      updatedSessions[sessionIndex] = {
        ...updatedSessions[sessionIndex],
        status: 'done',
      };

      updatedRoutineData.today.sessions = updatedSessions;

      // Cập nhật state và UI trước
      setRoutineData(updatedRoutineData);

      // Tạo payload để cập nhật lên server
      const dayToUpdate = {
        day_of_week: routineData.today.day_of_week,
        sessions: updatedSessions.map(s => ({
          ...s,
          // Đảm bảo session đang được cập nhật có status là 'done'
          status: s.time === session.time ? 'done' : s.status,
        })),
      };

      // Gọi API để cập nhật ngày lên server
      await services.UserRoutineService.updateDayofRoutine(dayToUpdate);

      // Refresh dữ liệu từ server
      queryFn();

      // Hiển thị thông báo thành công (tùy chọn)
      // Alert.alert('Success', 'Session đã được đánh dấu hoàn thành');
    } catch (error) {
      console.error('Error marking session as done:', error);
      Alert.alert('Error', 'Không thể cập nhật trạng thái session');

      // Nếu lỗi, refresh lại dữ liệu để đảm bảo UI đồng bộ với server
      queryFn();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => router.push('./routine')}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{routineData.routine_name}</Text>
          <Text style={styles.dayLabel}>{routineData.today.day_of_week}</Text>
        </View>
        <Switch
          value={notiEnabled ?? false}
          onValueChange={onToggleNoti}
          trackColor={{ false: '#767577', true: '#C5DFEC' }}
          thumbColor={notiEnabled ? '#FFFF' : '#f4f3f4'}
        />
      </TouchableOpacity>

      <View>
        {routineData.today.sessions?.map((session, index) => {
          const animValue = animatedSessions[index];

          return (
            <View
              key={`${session.time}-${index}`}
              style={{
                backgroundColor: getSessionBackgroundColor(session.status),
                borderRadius: variables.scale(20),
                marginBottom: variables.scale(16),
                marginHorizontal: variables.scale(16),
                overflow: 'hidden',
              }}
            >
              <TouchableOpacity
                style={[
                  styles.session,
                  { backgroundColor: getSessionBackgroundColor(session.status) },
                ]}
                onPress={() => toggleSession(index)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <LucideClock size={20} color={getStatusBadgeColor(session.status)} />
                  <Text style={styles.sessionTime}>{session.time}</Text>
                  {session.status === 'done' && <Check size={18} color="#4CAF50" />}
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusBadgeColor(session.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{session.status.toUpperCase()}</Text>
                </View>
              </TouchableOpacity>

              <Animated.View
                style={[
                  styles.expandedSession,
                  {
                    height: animValue?.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 60 * session.steps.length], // điều chỉnh nếu cần
                    }),
                    opacity: animValue?.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                    overflow: 'hidden',
                  },
                ]}
              >
                <View style={styles.stepsContainer}>
                  {session.steps.map((step, idx) => (
                    <View
                      key={`${step.step_order}-${idx}`}
                      style={[
                        styles.step,
                        { backgroundColor: 'rgba(255, 255, 255, 0.35)', borderRadius: 12 },
                      ]}
                    >
                      <View>
                        <View
                          style={[
                            styles.stepCircle,
                            { backgroundColor: getStatusBadgeColor(session.status) },
                          ]}
                        >
                          <Text style={styles.stepNumber}>{step.step_order}</Text>
                        </View>
                        {idx < session.steps.length - 1 && <View style={styles.verticalLine} />}
                      </View>
                      <Text style={styles.stepName}>{step.step_name}</Text>
                    </View>
                  ))}
                </View>
                {session.status === 'pending' && (
                  <TouchableOpacity
                    style={styles.markAsDoneContainer}
                    onPress={() => {
                      MarkDoneSession(session, index);
                    }}
                  >
                    <Check size={24} color={getStatusBadgeColor(session.status)} />
                  </TouchableOpacity>
                )}
              </Animated.View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: variables.scale(16),
    paddingVertical: variables.scale(24),
    marginHorizontal: variables.scale(16),
    borderRadius: variables.scale(24),
    backgroundColor: commonColor.ColorWhite,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: variables.scale(8),
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    marginBottom: variables.scale(16),
    paddingHorizontal: variables.scale(24),
  },
  title: {
    fontSize: variables.scale(34),
    fontWeight: '700',
    color: 'black',
  },
  dayLabel: {
    fontSize: variables.scale(22),
    color: 'gray',
  },
  session: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: variables.scale(24),
    paddingHorizontal: variables.scale(24),
    borderBottomWidth: 1,
    borderBottomColor: commonColor.ColorGray97,
  },
  sessionTime: {
    fontSize: variables.scale(28),
    color: 'black',
    fontWeight: '500',
  },
  statusBadge: {
    borderRadius: variables.scale(20),
    paddingVertical: variables.scale(4),
    paddingHorizontal: variables.scale(12),
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: variables.scale(18),
  },
  stepsContainer: {
    marginTop: variables.scale(40),
    flex: 1,
    marginRight: variables.scale(18),
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: variables.scale(48),
    position: 'relative',
    paddingLeft: variables.scale(10),
    paddingVertical: variables.scale(6),
    paddingRight: variables.scale(12),
  },
  stepCircle: {
    width: variables.scale(40),
    height: variables.scale(40),
    borderRadius: variables.scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: variables.scale(30),

    zIndex: 1,
  },
  verticalLine: {
    position: 'absolute',
    top: variables.scale(40),
    left: variables.scale(20),
    width: variables.scale(2),
    height: variables.scale(74),
    backgroundColor: '#957DAD',
    zIndex: 0,
  },
  stepNumber: {
    color: commonColor.ColorWhite,
    fontWeight: 'bold',
    fontSize: variables.scale(20),
  },
  stepName: {
    fontSize: variables.scale(26),
    color: 'black',
    paddingTop: variables.scale(5),
    fontWeight: '500',
    flexShrink: 1,
  },
  expandedSession: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: variables.scale(24),
  },
  markAsDoneContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    height: '90%',
    justifyContent: 'center',
    paddingHorizontal: variables.scale(24),
    borderRadius: variables.scale(20),
  },
});

export default RoutineCard;
