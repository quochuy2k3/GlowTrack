import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import variables from '@/theme/commonColor';
import commonColor from '@/theme/commonColor';
import CheckModuleIcon from '@/assets/svgs/checkModuleIcon';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useServices } from '@/services';

const EditModuleScreen = () => {
  const { userPlan } = useLocalSearchParams();
  const service = useServices();
  const userPlanData = JSON.parse(userPlan);
  const [pickedModule, setPickedModule] = useState(userPlanData?.[1]);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const handleDeleteModule = () => {
    fetchDetele();
  };
  useEffect(() => {
    navigation.setOptions({
      headerTitle: t('editModule'),
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={handleDeleteModule}>
          <Text style={styles.headerButtonText}>{t('delete')}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, pickedModule]);

  const fetchDetele = async () => {
    if (!pickedModule?.id) return;
    try {
      const res = await service.userPlans.deleteModule(pickedModule.id);
      if (Object.keys(res).length === 0 && res.constructor === Object) {
        router.back();
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        {userPlanData?.modules &&
          userPlanData?.modules?.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (index === 0) return;
                setPickedModule(item);
              }}
              style={styles.buttonItemModule}
            >
              <Text style={styles.textModule}>{item?.name}</Text>
              {pickedModule?.id === item?.id && index !== 0 ? (
                <CheckModuleIcon width={20} height={20} />
              ) : null}
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: variables.scale(20),
    paddingVertical: variables.scale(20),
  },
  buttonItemModule: {
    borderBottomColor: '#F5F5F7',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: variables.scale(40),
    paddingRight: variables.scale(40),
  },
  textModule: {
    fontSize: variables.scale(28),
    fontWeight: '700',
    color: '#303E65',
    fontFamily: commonColor.fontFamily,
    width: '90%',
  },
});

export default EditModuleScreen;
