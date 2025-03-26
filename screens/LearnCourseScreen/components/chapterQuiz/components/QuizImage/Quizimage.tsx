import React, { useContext, useEffect } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import variables from '@/theme/commonColor';
import { t } from 'i18next';
import commonColor from '@/theme/commonColor';
// import LMS_API from '../../../api/myElearning/api';

const QuizImage = ({ contentDetail, courseId, onLoadData, setIsCanNextQuestion }: any) => {
  const onFinish = async () => {
    // try {
    //   const response = await LMS_API.submitQuestion(
    //     courseId,
    //     contentDetail?.content,
    //   );
    //   if (response) {
    //     onLoadData && onLoadData();
    //   }
    // } catch (e) {
    //   console.error(e);
    // }
  };
  useEffect(() => {
    onFinish();
    setIsCanNextQuestion(true);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>{contentDetail?.contentObj?.title}</Text>

        <Image
          source={{
            uri: `${contentDetail?.contentObj?.thumbUrl || contentDetail?.contentObj?.sourceUrl}`,
          }}
          style={styles.processImage}
          resizeMode="contain"
        />
        {contentDetail?.contentObj?.content !== '' &&
          typeof contentDetail.contentObj.content === 'string' && (
            <View>
              <Text style={styles.aboutTitle}>About Lesson</Text>
              <Text style={styles.aboutText}>{contentDetail.contentObj.content}</Text>
            </View>
          )}
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
  },
  sectionTitle: {
    fontSize: variables.scale(40),
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: variables.scale(32),
  },
  processImage: {
    width: '100%',
    height: variables.scale(400),
    marginBottom: variables.scale(48),
  },
  aboutTitle: {
    fontSize: variables.scale(48),
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: variables.scale(24),
  },
  aboutText: {
    fontSize: variables.scale(32),
    lineHeight: variables.scale(48),
    color: '#4A5568',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: variables.scale(24),
    borderRadius: variables.scale(20),
    borderColor: '#E5E5E5',
    marginBottom: variables.scale(24),
    backgroundColor: variables.colorPrimary,
  },
  textButton: {
    color: '#fff',
    fontSize: variables.scale(30),
    fontWeight: '500',
  },
});

export default QuizImage;
