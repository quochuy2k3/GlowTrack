import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActionSheetIOS,
} from 'react-native';
import variables from '@/theme/commonColor';
import ListCourse from './components/ListCourse/ListCourse';
import { t } from 'i18next';
import DotIcon from '@/assets/svgs/DotIcon';
import userFetchUserPlans from '@/hooks/useFetchUserPlans';
import { router } from 'expo-router';

interface Props {}

export default function ListVideoCourse({}: Props) {
  const [isDetailVisible, setIsDetailVisible] = useState<boolean>(false);
  const { data: widgets } = userFetchUserPlans();
  const adjustModule = () => {
    const options = [t('addModule'), t('editModule'), t('cancel')];
    const cancelButtonIndex = options.length - 1;

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: options as string[],
        cancelButtonIndex,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            // Handle Add module
            router.push({
              pathname: '/module/addModule',
              params: {
                userPlan: JSON.stringify(widgets),
              },
            });
            break;
          case 1:
            router.push({
              pathname: '/module/editModule',
              params: {
                userPlan: JSON.stringify(widgets),
              },
            });
            break;
        }
      }
    );
  };

  const toggleDetail = (): void => {
    setIsDetailVisible(!isDetailVisible);
  };

  return (
    <View>
      <View style={styles.moduleContainer}>
        <View style={styles.headerModule}>
          <Text style={styles.titleModule}>{t('myLearning.advancingYourSalesCareer')}</Text>
          <TouchableOpacity style={styles.buttonDot} onPress={adjustModule}>
            <DotIcon width={22} height={22} />
          </TouchableOpacity>
        </View>
        <View style={styles.moreDescriptionModule}>
          <Text style={styles.description}>{t('myLearning.myLearningPlan')}</Text>
          <Text style={styles.dot}>・</Text>
          <TouchableOpacity onPress={toggleDetail}>
            <Text style={styles.showDetailText}>
              {isDetailVisible ? t('myLearning.hideDetails') : t('myLearning.showDetails')}
            </Text>
          </TouchableOpacity>
        </View>

        {isDetailVisible && (
          <>
            <View style={styles.headerModuleTwo}>
              <Text style={styles.titleModule}>{t('myLearning.aboutThePlan')}</Text>
              <View style={styles.wrapAboutThePlan}>
                <Image source={require('@/assets/images/Time.png')} />
                <Text style={{ marginLeft: variables.scale(10) }}>11h 48m of learning content</Text>
              </View>
            </View>

            <View style={styles.headerModuleTwo}>
              <Text style={styles.titleModule}>{t('myLearning.skillsCovered')}</Text>
              <View style={styles.wrapAboutThePlan}>
                <Text>
                  {widgets?.modules?.map((skill, idx) => (
                    <Text key={idx}>{idx === 0 ? skill?.name : ` • ${skill?.name}`}</Text>
                  ))}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
      <ListCourse />
    </View>
  );
}

const styles = StyleSheet.create({
  moduleContainer: {
    padding: variables.scale(40),
    marginTop: variables.scale(32),
  },
  headerModule: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerModuleTwo: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: variables.scale(50),
  },
  titleModule: {
    fontSize: variables.scale(36),
    fontWeight: '700',
    color: '#000000',
    width: '80%',
  },
  buttonDot: {
    width: variables.scale(40),
    height: variables.scale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreDescriptionModule: {
    marginTop: variables.scale(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    fontSize: variables.scale(30),
    fontWeight: '300',
    color: '#000000',
  },
  dot: {
    fontSize: variables.scale(30),
    fontWeight: '900',
    color: '#000000',
  },
  showDetailText: {
    fontSize: variables.scale(30),
    fontWeight: '300',
    color: '#000000',
    textDecorationLine: 'underline',
  },
  wrapAboutThePlan: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  skillItem: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 'normal',
    color: '#000',
  },
  bulletPoint: {
    fontWeight: 'bold',
    fontSize: 20,
    marginHorizontal: 4,
    lineHeight: 24,
  },
});
