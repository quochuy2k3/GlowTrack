import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import { t } from 'i18next';
import { useRouter } from 'expo-router';
import CardRequireLearning from './CardRequireLearning';
import DotIcon from '@/assets/svgs/DotIcon';
import variables from '@/theme/commonColor';
import { Spinner } from 'tamagui';
import { UserPlan } from '@/services/mylearning/models';
interface CourseSectionProps {
  widget: UserPlan;
  isLoading: boolean;
  codeName: string;
}

const CourseSection = ({ widget, isLoading, codeName }: CourseSectionProps) => {
  // state & props
  const router = useRouter();
  const visibleItems = widget.dataObj.slice(0, 3);

  // handle
  const adjustModule = (moduleId: string) => {
    const options = [t('addCourse'), t('editCourse'), t('cancel')];
    const cancelButtonIndex = options.length - 1;

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: options as string[],
        cancelButtonIndex,
        destructiveButtonIndex: 1,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            router.push({
              pathname: '/courses/addCourses',
              params: {
                moduleId: moduleId,
                dataObj: JSON.stringify(widget?.dataObj),
              },
            });
            break;
          case 1:
            router.push({
              pathname: '/courses/deleteCourses',
              params: {
                moduleId: moduleId,
                dataObj: JSON.stringify(widget?.dataObj),
              },
            });
            break;
        }
      }
    );
  };

  return (
    <View style={styles.widgetSection}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{widget.name}</Text>
        <TouchableOpacity onPress={() => adjustModule(widget?.id)}>
          {widget?.id && <DotIcon width={21} height={21} />}
        </TouchableOpacity>
      </View>

      {widget?.dataObj && widget?.dataObj.length > 0 ? (
        <View style={styles.content}>
          {visibleItems.map((item, index) => (
            <View key={index} style={styles.item}>
              <CardRequireLearning isSmall={true} course={item} />
            </View>
          ))}
          {isLoading && <Spinner />}
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: variables.scale(20),
          }}
        >
          <Image source={require('../../../../../assets/images/Empty.png')} resizeMode="cover" />
          <Text style={styles.text}>{t('drum')}</Text>
        </View>
      )}
      {widget.dataObj.length > 3 && (
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: '/courses',
              params: { codeName: codeName, isHome: 'false' },
            });
          }}
          style={styles.showAllButton}
        >
          <Text style={styles.showAllText}>
            {t('myLearning.showDetails')} ({widget.dataObj.length})
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingVertical: variables.scale(20),
  },
  item: {
    marginBottom: variables.scale(20),
  },
  widgetSection: {
    marginBottom: variables.scale(40),
    backgroundColor: '#ffffff',
    padding: variables.scale(40),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: variables.scale(20),
  },
  sectionTitle: {
    fontSize: variables.scale(36),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#000000',
  },
  courseCard: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  courseImage: {
    width: variables.scale(240),
    height: variables.scale(160),
    borderRadius: variables.scale(20),
  },
  courseInfo: {
    flex: 1,
    padding: variables.scale(24),
  },
  courseTitle: {
    fontSize: variables.scale(32),
    fontWeight: '500',
    marginBottom: variables.scale(8),
  },
  courseProgress: {
    fontSize: variables.scale(28),
    color: '#666',
  },
  showAllButton: {
    alignItems: 'flex-start',
    paddingVertical: variables.scale(16),
  },
  showAllText: {
    fontSize: variables.scale(28),
    color: variables.colorPrimary,
    textDecorationLine: 'underline',
  },
  loading: {
    padding: variables.scale(40),
    alignItems: 'center',
  },
  text: {
    fontSize: variables.scale(24),
    color: '#BFBFBF',
    marginTop: variables.scale(14),
    fontWeight: '300',
  },
});

export default CourseSection;
