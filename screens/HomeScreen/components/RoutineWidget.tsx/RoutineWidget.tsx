import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Animated,
  Easing,
  ScrollView,
  Alert,
} from 'react-native';
import commonColor from '@/theme/commonColor';
import variables from '@/theme/commonColor';
import { Check } from '@tamagui/lucide-icons';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useServices } from '@/services';
import { useAuth } from '@/contexts/auth';
import { RoutineTodayResponse } from '@/models/routine';
import { registerForPushNotificationsAsync } from '@/utils/registerNotification';
import { useNotification } from '@/contexts/NoticationContext';
interface Step {
  step_order: number;
  step_name: string;
}

interface Session {
  time: string;
  status: 'pending' | 'done' | 'not_done';
  steps: Step[];
}

const RoutineCard = ({}) => {
  const { notification, expoPushToken, error, setExpoPushToken, setError } = useNotification();
  const [routineData, setRoutineData] = useState<RoutineTodayResponse | null>(null);
  const services = useServices();
  const auth = useAuth();
  const [animatedSessions, setAnimatedSessions] = useState<{ [key: number]: Animated.Value }>({});
  const [pushToken, setPushToken] = useState<string | null>(expoPushToken);
  const [notiEnabled, setNotiEnabled] = useState(true);
  const { t } = useTranslation();

  // Hàm bật/tắt thông báo
  const onToggleNoti = async () => {
    try {
      if (notiEnabled) {
        // Tắt thông báo
        setNotiEnabled(false);
        setPushToken(null);
      } else {
        // Yêu cầu quyền thông báo và bật thông báo
        if (expoPushToken) {
          setPushToken(expoPushToken);
          setNotiEnabled(true);
        } else {
          registerForPushNotificationsAsync().then(
            token => {
              setExpoPushToken(token);
              setPushToken(token);
              setNotiEnabled(true);
            },
            error => setError(error)
          );
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Không thể thực hiện hành động này');
    }
  };
  const { data: routineToday, isLoading: isLoadingRoutineDay } = useQuery({
    queryFn: services.UserRoutineService.getRoutineToday,
    queryKey: ['routineToday'],
    enabled: auth.isAuthenticated,
  });
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
    services.UserRoutineService.updatePushToken(pushToken ?? '');
  }, [pushToken]);
  useEffect(() => {
    const fetchRoutineData = async () => {
      if (!routineToday) return;

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
        return '#CEB8E4';
      case 'done':
        return '#A5D6A7';
      case 'not_done':
        return '#EF9A9A';
    }
  };

  const getSessionBackgroundColor = (status: Session['status']) => {
    switch (status) {
      case 'pending':
        return '#F3E8FB';
      case 'done':
        return '#E8F5E9';
      case 'not_done':
        return '#FFEBEE';
    }
  };

  if (!routineData) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{routineData.routine_name}</Text>
          <Text style={styles.dayLabel}>{routineData.today.day_of_week}</Text>
        </View>
        <Switch
          value={notiEnabled}
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
                  <Text style={styles.sessionTime}>
                    {t('you_have_routine_at')} {session.time}
                  </Text>
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
                  <TouchableOpacity style={styles.markAsDoneContainer}>
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
    color: '#333',
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
    fontSize: variables.scale(16),
  },
  stepName: {
    fontSize: variables.scale(24),
    color: 'black',
    paddingTop: variables.scale(5),
    paddingLeft: variables.scale(12),
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
