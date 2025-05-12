import { REMINDER_COOLDOWN } from '@/constants';
import { useAuth } from '@/contexts/auth';
import { useServices } from '@/services';
import { CoupleResponse, Partner, PartnerRoutineSession } from '@/services/couple/couple.service';
import commonColor from '@/theme/commonColor';
import variables from '@/theme/commonColor';
import { Bell, Check, Clock, X } from '@tamagui/lucide-icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Animated, Easing, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Spinner, Text, View, XStack, YStack } from 'tamagui';

interface CoupleDetailProps {
  couple: CoupleResponse;
  onCoupleRemoved: () => void;
  setCouple: (couple: CoupleResponse) => void;
}

export const CoupleDetail = ({ couple, onCoupleRemoved, setCouple }: CoupleDetailProps) => {
  const services = useServices();
  const { t } = useTranslation();
  const [animatedSessions, setAnimatedSessions] = useState<{ [key: number]: Animated.Value }>({});
  const [expandedSessions, setExpandedSessions] = useState<{ [key: number]: boolean }>({});
  const pulseAnim = React.useRef(new Animated.Value(0)).current;
  const [reminderCooldowns, setReminderCooldowns] = useState<{ [key: string]: number }>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const circleAnim = React.useRef(new Animated.Value(0)).current;
  const [partnerRemovalLoading, setPartnerRemovalLoading] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(circleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, [circleAnim]);
  const refreshCouple = () => {
    services.couple.getCouple().then(result => {
      setCouple(result);
    });
  };
  useEffect(() => {
    if (couple?.partner?.today_routine?.today?.sessions) {
      const animState: { [key: number]: Animated.Value } = {};
      const expandedState: { [key: number]: boolean } = {};
      const sessions = [...couple.partner.today_routine.today.sessions];

      sessions.forEach((session, idx: number) => {
        animState[idx] = new Animated.Value(0);

        const shouldExpand =
          session.status === 'pending' && isSessionWithinReminderWindow(session.time);
        expandedState[idx] = shouldExpand;
      });

      setAnimatedSessions(animState);
      setExpandedSessions(expandedState);

      setTimeout(() => {
        sessions.forEach((session, idx: number) => {
          const shouldExpand =
            session.status === 'pending' && isSessionWithinReminderWindow(session.time);
          if (shouldExpand && animState[idx]) {
            Animated.timing(animState[idx], {
              toValue: 1,
              duration: 260,
              easing: Easing.out(Easing.ease),
              useNativeDriver: false,
            }).start();
          }
        });
      }, 100);
    }
  }, [couple]);

  const toggleSession = (index: number) => {
    const animatedValue = animatedSessions[index];
    if (!animatedValue) return;

    const isExpanded = expandedSessions[index] || false;

    setExpandedSessions(prev => ({
      ...prev,
      [index]: !isExpanded,
    }));

    Animated.timing(animatedValue, {
      toValue: isExpanded ? 0 : 1,
      duration: 260,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const isSessionWithinReminderWindow = (sessionTime: string): boolean => {
    if (!sessionTime) return false;

    const timeRegex = /(\d+):(\d+)\s+(AM|PM)/i;
    const match = sessionTime.match(timeRegex);

    if (!match) return false;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toUpperCase();

    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    const sessionDate = new Date();
    sessionDate.setHours(hours, minutes, 0, 0);

    const now = currentTime;

    const diffInMinutes = Math.abs((sessionDate.getTime() - now.getTime()) / (1000 * 60));

    return diffInMinutes <= 60;
  };

  const restartCircleAnimation = () => {
    circleAnim.setValue(0);
    Animated.loop(
      Animated.timing(circleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  };

  const sendReminder = (session: PartnerRoutineSession) => {
    try {
      const sessionKey = session.time;
      setReminderCooldowns(prev => ({ ...prev, [sessionKey]: REMINDER_COOLDOWN }));

      restartCircleAnimation();

      const countdownInterval = setInterval(() => {
        setReminderCooldowns(prev => {
          const currentCount = prev[sessionKey];
          if (currentCount <= 1) {
            clearInterval(countdownInterval);
            return { ...prev, [sessionKey]: 0 };
          }
          return { ...prev, [sessionKey]: currentCount - 1 };
        });
      }, 1000);

      // Get partner ID and push token
      const partnerId = couple.partner.id;
      const pushToken = couple.partner.today_routine?.push_token ?? '';
      services.couple
        .sendRoutineReminder(partnerId, pushToken)
        .then(result => {
          if (result.success) {
            refreshCouple();
          }
        })
        .catch(err => {
          Alert.alert('Error', 'Failed to send reminder');
        });
    } catch (error) {
      console.error('Error in reminder process:', error);
      Alert.alert('Error', 'Failed to send reminder');
    }
  };

  const handleRemovePartner = () => {
    if (!couple) return;

    Alert.alert('Remove Partner', 'Are you sure you want to remove your partner?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            setPartnerRemovalLoading(true);

            const result = await services.couple.removePartner(couple.id);

            if (result.success) {
              Alert.alert('Success', result.message);
              onCoupleRemoved();
            } else {
              Alert.alert('Error', 'Failed to remove partner');
            }
          } catch (error) {
            console.error('Failed to remove partner:', error);
            Alert.alert('Error', 'Failed to remove partner');
          } finally {
            setPartnerRemovalLoading(false);
          }
        },
      },
    ]);
  };

  const getStatusColor = (status: 'pending' | 'done' | 'not_done') => {
    switch (status) {
      case 'pending':
        return '#FFC107';
      case 'done':
        return '#4CAF50';
      case 'not_done':
        return '#F44336';
      default:
        return '#FFC107';
    }
  };

  const getSessionBackgroundColor = (status: 'pending' | 'done' | 'not_done') => {
    switch (status) {
      case 'pending':
        return '#FFF8E1';
      case 'done':
        return '#E8F5E9';
      case 'not_done':
        return '#FFEBEE';
      default:
        return '#FFF8E1';
    }
  };

  const partner = couple.partner;

  return (
    <ScrollView>
      <View style={styles.partnerCard}>
        <XStack style={{ alignItems: 'center', justifyContent: 'space-between' }} space="$3">
          <Avatar circular size="$6">
            {partner.avatar ? (
              <Avatar.Image src={partner.avatar} />
            ) : (
              <Avatar.Fallback
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: 'black',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.5,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text fontSize={24} fontWeight="bold">
                  {partner.fullname.charAt(0)}
                </Text>
              </Avatar.Fallback>
            )}
          </Avatar>
          <YStack flex={1}>
            <Text style={styles.partnerName}>{partner.fullname}</Text>
            <Text style={styles.partnerEmail}>{partner.email}</Text>
          </YStack>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={handleRemovePartner}
            disabled={partnerRemovalLoading}
          >
            {partnerRemovalLoading ? (
              <Spinner size="small" color="#FFF" />
            ) : (
              <X size={20} color="#FFF" />
            )}
          </TouchableOpacity>
        </XStack>
      </View>

      <Animated.View
        style={[
          styles.streakCard,
          {
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          },
        ]}
      >
        <Animated.View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: partner.today_tracker
              ? pulseAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#E8F5E9', '#A5D6A7'],
                })
              : pulseAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#FFF8E1', '#FFE082'],
                }),
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 4,
            borderColor: partner.today_tracker ? '#4CAF50' : '#FFC107',
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#333' }}>
            {partner.streak || 0}
          </Text>
          <Text style={{ fontSize: 16, color: '#666' }}>days</Text>
        </Animated.View>
        <Text style={styles.streakStatus}>
          {partner.today_tracker
            ? "Partner has completed today's skincare routine!"
            : "Partner hasn't completed today's skincare routine yet."}
        </Text>
      </Animated.View>

      {partner.today_routine && (
        <View style={styles.routineContainer}>
          <View style={styles.routineHeader}>
            <Text style={styles.routineTitle}>{partner.today_routine.routine_name}</Text>
            <Text style={styles.routineDay}>{partner.today_routine.today.day_of_week}</Text>
          </View>

          {partner.today_routine.today.sessions.map((session, index) => (
            <View
              key={`${session.time}-${index}`}
              style={[
                styles.sessionContainer,
                { backgroundColor: getSessionBackgroundColor(session.status) },
              ]}
            >
              <TouchableOpacity style={styles.sessionHeader} onPress={() => toggleSession(index)}>
                <XStack style={{ alignItems: 'center' }} space="$2">
                  <Clock size={20} color={getStatusColor(session.status)} />
                  <Text style={styles.sessionTime}>{session.time}</Text>
                  {session.status === 'done' && <Check size={18} color="#4CAF50" />}
                </XStack>
                <View
                  style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) }]}
                >
                  {session.status === 'pending' && isSessionWithinReminderWindow(session.time) ? (
                    <TouchableOpacity
                      style={styles.reminderBadgeButton}
                      onPress={() => sendReminder(session)}
                      disabled={!!reminderCooldowns[session.time]}
                    >
                      {reminderCooldowns[session.time] ? (
                        <View style={styles.countdownContainer}>
                          <Animated.View
                            style={[
                              styles.countdownCircle,
                              {
                                transform: [
                                  {
                                    rotate: circleAnim.interpolate({
                                      inputRange: [0, 1],
                                      outputRange: ['0deg', '360deg'],
                                    }),
                                  },
                                ],
                              },
                            ]}
                          />
                          <Text style={styles.countdownText}>
                            {reminderCooldowns[session.time]}s
                          </Text>
                        </View>
                      ) : (
                        <>
                          <Bell size={16} color="#FFF" />
                          <Text style={[styles.statusText, { fontSize: variables.scale(24) }]}>
                            Nhắc nhở
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.statusText}>{session.status.toUpperCase()}</Text>
                  )}
                </View>
              </TouchableOpacity>
              <Animated.View
                style={[
                  styles.expandedSession,
                  {
                    height: animatedSessions[index]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, session.steps.length ? 40 * session.steps.length : 40],
                    }),
                    opacity: animatedSessions[index]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                    overflow: 'hidden',
                  },
                ]}
              >
                {session.steps.length > 0 ? (
                  <View style={styles.stepsContainer}>
                    {session.steps.map((step, stepIdx) => (
                      <View key={`step-${stepIdx}`} style={styles.stepItem}>
                        <View>
                          <View
                            style={[
                              styles.stepCircle,
                              { backgroundColor: getStatusColor(session.status) },
                            ]}
                          >
                            <Text style={styles.stepNumber}>{step.step_order}</Text>
                          </View>
                          {stepIdx < session.steps.length - 1 && (
                            <View style={styles.verticalLine} />
                          )}
                        </View>
                        <Text style={styles.stepName}>{step.step_name}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.stepsContainer}>
                    <Text style={{ color: '#999', fontStyle: 'italic', textAlign: 'center' }}>
                      Không có bước nào cho session này
                    </Text>
                  </View>
                )}
              </Animated.View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  partnerCard: {
    margin: variables.scale(32),
    padding: variables.scale(32),
    backgroundColor: '#fff',
    borderRadius: variables.scale(32),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: variables.scale(4) },
    shadowOpacity: 0.1,
    shadowRadius: variables.scale(8),
    elevation: 3,
  },
  partnerName: {
    fontSize: variables.scale(36),
    fontWeight: 'bold',
    color: '#333',
  },
  partnerEmail: {
    fontSize: variables.scale(28),
    color: '#666',
  },
  removeButton: {
    backgroundColor: '#F44336',
    width: variables.scale(72),
    height: variables.scale(72),
    borderRadius: variables.scale(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakCard: {
    margin: variables.scale(32),
    marginTop: 0,
    padding: variables.scale(40),
    borderRadius: variables.scale(32),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: variables.scale(4) },
    shadowOpacity: 0.1,
    shadowRadius: variables.scale(8),
    elevation: 3,
  },
  streakTitle: {
    fontSize: variables.scale(32),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: variables.scale(16),
  },
  streakStatus: {
    fontSize: variables.scale(28),
    textAlign: 'center',
    color: '#666',
    marginTop: variables.scale(16),
  },
  routineContainer: {
    margin: variables.scale(32),
    marginTop: 0,
    padding: variables.scale(32),
    backgroundColor: '#fff',
    borderRadius: variables.scale(32),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: variables.scale(4) },
    shadowOpacity: 0.1,
    shadowRadius: variables.scale(8),
    elevation: 3,
  },
  routineHeader: {
    marginBottom: variables.scale(32),
  },
  routineTitle: {
    fontSize: variables.scale(40),
    fontWeight: 'bold',
    color: '#333',
  },
  routineDay: {
    fontSize: variables.scale(32),
    color: '#666',
  },
  sessionContainer: {
    borderRadius: variables.scale(24),
    marginBottom: variables.scale(24),
    overflow: 'hidden',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: variables.scale(32),
  },
  sessionTime: {
    fontSize: variables.scale(28),
    fontWeight: '500',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: variables.scale(16),
    paddingVertical: variables.scale(8),
    borderRadius: variables.scale(24),
  },
  statusText: {
    fontSize: variables.scale(18),
    fontWeight: 'bold',
    color: '#FFF',
  },
  expandedSession: {
    overflow: 'hidden',
  },
  stepsContainer: {
    padding: variables.scale(32),
    paddingTop: 0,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: variables.scale(24),
  },
  stepCircle: {
    width: variables.scale(50),
    height: variables.scale(50),
    borderRadius: variables.scale(30),
    marginRight: variables.scale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalLine: {
    position: 'absolute',
    top: variables.scale(50),
    left: variables.scale(25),
    width: variables.scale(2),
    height: variables.scale(70),
    backgroundColor: '#957DAD',
    zIndex: 0,
  },
  stepNumber: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: variables.scale(22),
  },
  stepName: {
    fontSize: variables.scale(26),
    color: '#333',
  },
  reminderBadgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: variables.scale(8),
    backgroundColor: '#FFC107',
    borderRadius: variables.scale(24),
    paddingVertical: variables.scale(10),
    paddingHorizontal: variables.scale(12),
    opacity: 1,
  },
  countdownContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: variables.scale(70),
    height: variables.scale(36),
  },
  countdownCircle: {
    position: 'absolute',
    width: variables.scale(56),
    height: variables.scale(56),
    borderRadius: variables.scale(36),
    borderWidth: 2,
    borderColor: '#FFF',
    borderTopColor: 'transparent',
  },
  countdownText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: variables.scale(20),
  },
});
