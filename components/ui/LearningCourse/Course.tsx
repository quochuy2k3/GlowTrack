import React, { useContext, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, Text, View, Platform } from 'react-native';
import variables from '@/theme/commonColor';
import Checkbox from '../../../assets/svgs/Checkbox';
import CheckboxActive from '../../../assets/svgs/CheckboxActive';
import { useTranslation } from 'react-i18next';
import utils from '@/utils';
import { router } from 'expo-router';

type IPropsCourse = {
  course: any;
  onCheckboxChange: (courseId: string, isChecked: boolean) => void;
  isLastItem: boolean;
  isCheckbox: boolean;
  disabled?: boolean;
};
const Course = ({ course, onCheckboxChange, isLastItem, isCheckbox, disabled }: IPropsCourse) => {
  const [isChecked, setIsChecked] = useState(disabled || false);
  const { t } = useTranslation();
  const handleCheckboxClick = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onCheckboxChange(course.id, newCheckedState);
  };

  const imageSource = course?.coverImageUrl
    ? { uri: course?.coverImageUrl }
    : require('@/assets/images/tanca_elearning_logo.e92fad6a61c7388e4df6.jpg');

  if (!course) {
    return null;
  }

  const onClickDetail = (courseId: string): void => {
    router.push({
      pathname: '/courses/detail/[id]',
      params: { id: courseId },
    });
  };

  return (
    <TouchableOpacity
      onPress={() => onClickDetail(course?.id)}
      style={[styles.card, isLastItem && { borderBottomWidth: 0 }]}
    >
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        {course?.duration ? (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{utils.formatTime(course?.duration)}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        <Text style={styles.source}>{t(course?.source || course?.type)}</Text>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
          {course?.title}
        </Text>
        <Text style={styles.source}>
          {course?.totalParticipants || 0} {t('learners')}
        </Text>
      </View>

      {isCheckbox && !disabled && (
        <TouchableOpacity onPress={handleCheckboxClick}>
          {isChecked ? <CheckboxActive /> : <Checkbox />}
        </TouchableOpacity>
      )}
      {disabled && <CheckboxActive colorBg="#ccc" colorFill="#999" />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: variables.scale(4) },
    shadowOpacity: 0.1,
    shadowRadius: variables.scale(12),
    marginTop: variables.scale(32),
    paddingBottom: variables.scale(40),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F7',
  },
  imageContainer: {
    width: variables.scale(190),
    height: variables.scale(100),
    marginRight: variables.scale(16),
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 0.1,
    justifyContent: 'flex-end',
    ...Platform.select({
      android: {
        elevation: 1,
        borderRadius: variables.scale(14),
        backgroundColor: '#fff',
      },
    }),
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: variables.scale(10),
    resizeMode: 'cover',
  },
  durationBadge: {
    position: 'absolute',
    bottom: variables.scale(5),
    right: variables.scale(5),
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: variables.scale(10),
    paddingVertical: variables.scale(4),
    borderRadius: variables.scale(8),
  },
  durationText: {
    color: 'white',
    fontSize: variables.scale(18),
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingLeft: variables.scale(5),
  },
  source: {
    fontSize: variables.scale(22),
    color: '#666',
  },
  title: {
    fontSize: variables.scale(26),
    fontWeight: 'bold',
    color: '#333',
    marginTop: variables.scale(5),
    width: '90%',
    lineHeight: variables.scale(40),
  },
});

export default Course;
