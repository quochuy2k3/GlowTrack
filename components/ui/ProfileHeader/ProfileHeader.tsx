import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { t } from 'i18next';
import variables from '@/theme/commonColor';

interface ProfileHeaderProps {
  setCareerGoal?: (value: boolean) => void;
}

export default function ProfileHeader({ setCareerGoal }: ProfileHeaderProps) {
  const user = {
    name: 'Nguyễn Văn A',
    position: 'Giám đốc',
  };
  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={{ borderRadius: variables.scale(100) }}>
          <Image source={require('@/assets/avatardefault.png')} style={styles.avatar} />
        </View>
        <View style={{ marginLeft: variables.scale(30), flex: 1 }}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.role}>{user?.position}</Text>
        </View>
      </View>

      <View style={styles.careerSection}>
        <Text
          style={Platform.select({
            ios: styles.careerTitle,
            android: { ...styles.careerTitle, fontWeight: 'bold' },
          })}
        >
          {t('myLearning.careerGoal')}
        </Text>
        <View style={styles.careerDescription}>
          <Text style={{ fontWeight: '300' }}>{t('myLearning.careerGoalDescription')}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setCareerGoal(false);
            }}
          >
            <Text style={styles.buttonText}>{t('home.setYourCareerGoal')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: variables.scale(40),
    marginHorizontal: variables.scale(32),
    marginTop: variables.scale(32),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: variables.scale(12),
    elevation: 6,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: variables.scale(48),
    flex: 1,
  },
  avatarContainer: {
    width: variables.scale(200),
    height: variables.scale(200),
    borderRadius: variables.scale(100),
    backgroundColor: '#FFF0F7',
    padding: variables.scale(8),
    marginBottom: variables.scale(24),
  },
  avatar: {
    borderRadius: variables.scale(40),
  },
  name: {
    fontSize: variables.scale(48),
    fontWeight: '500',
    color: '#111',
    marginBottom: variables.scale(8),
  },
  role: {
    fontSize: variables.scale(26),
    color: '#666',
  },
  careerSection: {
    marginTop: variables.scale(16),
  },
  careerTitle: {
    fontSize: variables.scale(32),
    fontWeight: '600',
    color: '#111',
    marginBottom: variables.scale(16),
  },
  careerDescription: {
    fontSize: variables.scale(26),
    color: '#333',
    marginBottom: variables.scale(32),
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    borderWidth: 1,
    borderColor: variables.colorPrimary,
    paddingVertical: variables.scale(24),
    paddingHorizontal: variables.scale(48),
    borderRadius: variables.scale(48),
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: variables.colorPrimary,
    fontSize: variables.scale(24),
    fontWeight: '500',
  },
  dottedLine: {
    flex: 1,
    height: 2,
    marginLeft: variables.scale(24),
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: '#FF9800',
    borderRadius: 1,
  },
  boldText: {
    fontWeight: '600', // Để phần position in đậm
    flexShrink: 1,
  },
});
