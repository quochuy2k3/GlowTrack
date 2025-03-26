import React, { useEffect } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import variables from '@/theme/commonColor';
// import LMS_API from '../../../api/myElearning/api';
// import * as utils from '@src/utils';
const QuizText = ({ contentDetail, courseId, onLoadData, setIsCanNextQuestion }: any) => {
  const { contentObj } = contentDetail;

  const onFinish = async () => {
    try {
      // const response = await LMS_API.submitQuestion(
      //   courseId,
      //   contentDetail?.content,
      // );
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

  const htmlContent = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      <style>
        body {
          font-family: 'Roboto', sans-serif;
        }
        img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
        }
      </style>
    </head>
    <body>
      ${decodeURIComponent(contentObj?.content)}
    </body>
  </html>`;
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          marginBottom: variables.scale(30),
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: variables.scale(32),
            textAlign: 'center',
          }}
        >
          {contentObj?.title}
        </Text>
      </View>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent, baseUrl: '' }}
        style={{ width: '100%', height: Platform.OS === 'ios' ? 540 : 420 }}
        scrollEnabled={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default QuizText;
