// import React, { useState, useEffect, useContext } from 'react';
// import { View, Text, TouchableOpacity, Slider, StyleSheet } from 'react-native';
// import TrackPlayer, { useProgress } from 'react-native-track-player';
// import AudioPlayer from '../../../components/AudioPlayer/AudioPlayer';
// import variables from '@theme/variables/commonColor';
// import Spinner from '@src/components/ui/Spinner';
// import * as utils from '@src/utils';
// import LMS_API from '../../../api/myElearning/api';

// import Messages from '@src/translations/Messages';
// import { IntlContext } from '@src/components/application/systemProvider';
// const QuizAudio = ({
//   contentDetail,
//   courseId,
//   onLoadData,
//   setIsCanNextQuestion,
// }) => {
//   const { contentObj } = contentDetail;
//   const audioPath = contentObj?.thumbUrl || contentObj?.sourceUrl;
//   const intl = useContext(IntlContext);
//   const onFinish = async () => {
//     try {
//       const response = await LMS_API.submitQuestion(
//         courseId,
//         contentDetail?.content,
//       );
//       if (response) {
//         onLoadData && onLoadData();
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };
//   useEffect(() => {
//     onFinish();
//     setIsCanNextQuestion(true);
//   }, []);
//   return (
//     <View>
//       <AudioPlayer
//         audioPath={`${audioPath}`}
//         title={contentObj?.title}
//         artist=""
//       />
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   button: {
//     padding: variables.scale(24),
//     borderRadius: variables.scale(32),
//     alignItems: 'center',
//     marginTop: variables.scale(16),
//     borderWidth: 1,
//     backgroundColor: variables.colorPrimary, // Màu chính
//     borderColor: variables.colorPrimary,
//   },
//   textButton: {
//     color: `#ffffff`,
//     fontSize: variables.scale(30),
//     fontWeight: '500',
//   },
// });

// export default QuizAudio;
