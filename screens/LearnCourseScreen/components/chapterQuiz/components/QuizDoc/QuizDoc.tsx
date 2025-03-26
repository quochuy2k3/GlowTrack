import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { downloadFile, getDownloadPermissionAndroid } from './util';
import variables from '@/theme/commonColor';
import { t } from 'i18next';

const QuizDoc = ({ contentDetail, courseId, onLoadData, setIsCanNextQuestion }: any) => {
  const { contentObj } = contentDetail;
  const { sourceUrl, thumbUrl } = contentObj;

  const onFinish = async () => {
    try {
      // Mock API call
      const response = {};
      if (response) {
        onLoadData && onLoadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    onFinish();
    setIsCanNextQuestion(true);
  }, []);

  const handleDownload = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await getDownloadPermissionAndroid();
        if (granted) {
          await downloadFile(sourceUrl);
        }
      } else {
        await downloadFile(sourceUrl);
      }
    } catch (error) {
      Alert.alert(t('error'), t('download_failed'));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.questionText}>{contentObj?.title}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoIcon}>
            <Image source={require('@/assets/images/information-circle.png')} />
          </View>
          <Text style={styles.infoText}>{t('review_file_to_mark_this_lesson')}</Text>
        </View>

        <View style={styles.docContainer}>
          <View style={styles.docPreview}>
            <Image
              source={require('@/assets/images/doc.png')}
              style={styles.docIcon}
              resizeMode="contain"
            />
            <Text style={styles.docName}>{contentObj?.title}</Text>
          </View>

          <TouchableOpacity style={styles.downDocButton} onPress={handleDownload}>
            <Image
              style={{ marginRight: variables.scale(10) }}
              source={require('@/assets/images/Download.png')}
            />
            <Text style={styles.downDocButtonText}>{t('download')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: variables.scale(32),
    fontWeight: '600',
    marginBottom: variables.scale(32),
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: variables.scale(64),
  },
  infoText: {
    fontSize: variables.scale(28),
    color: '#666',
    marginLeft: variables.scale(10),
  },
  docContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D6D8E0',
    borderRadius: variables.scale(16),
    paddingHorizontal: variables.scale(100),
    alignItems: 'center',
    backgroundColor: '#FBFBFC',
    marginBottom: variables.scale(16),
    justifyContent: 'space-between',
  },
  docPreview: {
    alignItems: 'center',
    marginBottom: variables.scale(32),
    paddingVertical: variables.scale(100),
  },
  docIcon: {
    width: variables.scale(120),
    height: variables.scale(120),
    marginBottom: variables.scale(16),
  },
  docName: {
    fontSize: variables.scale(32),
    color: '#333',
    textAlign: 'center',
  },
  downDocButton: {
    backgroundColor: variables.colorPrimary,
    paddingVertical: variables.scale(20),
    paddingHorizontal: variables.scale(30),
    borderRadius: variables.scale(30),
    marginTop: variables.scale(16),
    marginBottom: variables.scale(50),
    flexDirection: 'row',
    alignItems: 'center',
  },
  downDocButtonText: {
    color: '#FFFFFF',
    fontSize: variables.scale(32),
    fontWeight: '500',
  },
});

export default QuizDoc;
