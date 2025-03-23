// import { useContext, useEffect, useState } from 'react';
// import React from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   StatusBar,
//   SafeAreaView,
// } from 'react-native';
// import variables from '@theme/variables/commonColor';
// import Messages from '../../../../../../translations/Messages';
// import { IntlContext } from '@src/components/application/systemProvider';
// import LMS_API from '../../../api/myElearning/api';
// const { width: screenWidth } = Dimensions.get('window');
// import commonColor from '@theme/variables/commonColor';

// const QuizImageMap = ({
//   contentDetail,
//   courseId,
//   onLoadData,
//   setIsCanNextQuestion,
// }) => {
//   const intl = useContext(IntlContext);
//   const minSelections = 2;
//   const { contentObj } = contentDetail;
//   const [selectedPoints, setSelectedPoints] = useState([]);
//   const [isCorrect, setIsCorrect] = useState(false);
//   const [hasSubmitted, setHasSubmitted] = useState(false);

//   useEffect(() => {
//     if (contentDetail?.userAnswers) {
//       setIsCanNextQuestion(true);
//       setHasSubmitted(true);
//     } else {
//       setIsCanNextQuestion(false);
//       setHasSubmitted(false);
//     }
//   }, []);

//   const handleImagePress = (event) => {
//     const { locationX, locationY } = event.nativeEvent;
//     const newPoint = {
//       left: locationX,
//       top: locationY,
//       right: locationX + 1,
//       bottom: locationY + 1,
//       originalWidth: screenWidth * 0.9,
//       originalHeight: screenWidth * 0.9,
//     };

//     const pointExists = selectedPoints.some(
//       (point) =>
//         Math.sqrt(
//           Math.pow(point.left - newPoint.left, 2) +
//             Math.pow(point.top - newPoint.top, 2),
//         ) < 20,
//     );

//     if (pointExists) {
//       setSelectedPoints(
//         selectedPoints.filter(
//           (point) =>
//             Math.sqrt(
//               Math.pow(point.left - newPoint.left, 2) +
//                 Math.pow(point.top - newPoint.top, 2),
//             ) >= 20,
//         ),
//       );
//     } else if (selectedPoints.length < 2) {
//       setSelectedPoints([...selectedPoints, newPoint]);
//     }
//   };

//   const handleRetry = () => {
//     setSelectedPoints([]);
//     setHasSubmitted(false);
//     setIsCorrect(false);
//     setIsCanNextQuestion(false);
//   };

//   const handleSubmit = async () => {
//     if (hasSubmitted) {
//       handleRetry();
//     } else {
//       const response = await LMS_API.submitQuestionPickAPoint(
//         contentDetail?.course,
//         contentObj?.id,
//         selectedPoints,
//         contentObj?.type,
//       );
//       if (!response?.userAnswer?.correctAnswers?.point) {
//         setIsCorrect(response?.userAnswer?.correctAnswers?.point > 0);
//       }
//       setHasSubmitted(true);
//       setIsCanNextQuestion(true);
//     }
//   };

//   const isSubmitEnabled = selectedPoints.length >= minSelections;

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* <StatusBar barStyle="dark-content" /> */}
//       <View style={styles.content}>
//         {/* Question */}
//         <Text style={styles.question}>{contentDetail?.title}</Text>
//         <Text style={styles.helperText}>
//           {intl.formatMessage(
//             Messages.find_the_key_area_of_the_image_by_clicking_it,
//           )}
//         </Text>

//         {/* Image with selectable points */}
//         <View style={styles.imageContainer}>
//           <TouchableOpacity activeOpacity={1} onPress={handleImagePress}>
//             <Image
//               source={{ uri: contentObj?.content?.imageUrl }}
//               style={styles.image}
//               resizeMode="contain"
//             />

//             {/* Render selected points */}
//             {selectedPoints.map((point, index) => (
//               <View
//                 key={index}
//                 style={[
//                   styles.selectedPoint,
//                   { left: point.left - 10, top: point.top - 10 },
//                 ]}
//               />
//             ))}
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity
//           style={[
//             styles.submitButton,
//             isSubmitEnabled
//               ? styles.submitButtonActive
//               : styles.submitButtonDisabled,
//           ]}
//           onPress={handleSubmit}
//           disabled={!isSubmitEnabled}>
//           <Text
//             style={[
//               styles.submitButtonText,
//               isSubmitEnabled
//                 ? styles.submitButtonTextEnabled
//                 : styles.submitButtonTextDisabled,
//             ]}>
//             {hasSubmitted
//               ? intl.formatMessage(Messages.retry)
//               : intl.formatMessage(Messages.submit)}
//           </Text>
//         </TouchableOpacity>

//         {hasSubmitted && // Show the message only if the user has submitted
//           (isCorrect ? (
//             <View style={styles.correctContainer}>
//               <Text style={styles.correctText}>
//                 {intl.formatMessage(Messages.correct_answer)}
//               </Text>
//             </View>
//           ) : (
//             <View style={styles.incorrectContainer}>
//               <Text style={styles.incorrectText}>
//                 {intl.formatMessage(Messages.your_answer_was_incorrect)}
//               </Text>
//             </View>
//           ))}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   titleContainer: {
//     marginLeft: variables.scale(16),
//   },
//   title: {
//     fontSize: variables.scale(18),
//     fontWeight: '600',
//     color: '#333',
//   },
//   subtitle: {
//     fontSize: variables.scale(28),
//     color: '#666',
//   },
//   content: {
//     flex: 1,
//     padding: variables.scale(0),
//   },
//   question: {
//     fontSize: variables.scale(32),
//     fontWeight: '600',
//     marginBottom: variables.scale(16),
//     color: '#333',
//   },
//   helperText: {
//     fontSize: variables.scale(28),
//     color: '#666',
//     marginBottom: variables.scale(32),
//   },
//   imageContainer: {
//     position: 'relative',
//     alignItems: 'center',
//     borderRadius: variables.scale(16),
//     overflow: 'hidden',
//   },
//   image: {
//     width: screenWidth * 0.9,
//     height: screenWidth * 0.9,
//     borderRadius: variables.scale(16),
//     resizeMode: 'contain',
//   },
//   selectedPoint: {
//     position: 'absolute',
//     width: variables.scale(30),
//     height: variables.scale(30),
//     borderRadius: variables.scale(20),
//     backgroundColor: '#39FD9E',
//     opacity: 0.8,
//   },
//   submitButton: {
//     paddingVertical: variables.scale(28),
//     borderRadius: variables.scale(36),
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: variables.scale(30),
//   },
//   submitButtonEnabled: {
//     backgroundColor: '#4CD964',
//   },
//   submitButtonText: {
//     fontSize: variables.scale(32),
//     fontWeight: '600',
//   },
//   submitButtonTextEnabled: {
//     color: 'white',
//   },
//   submitButtonTextDisabled: {
//     color: '#BFBFBF',
//     fontSize: variables.scale(32),
//     fontWeight: '600',
//   },
//   submitButtonDisabled: {
//     backgroundColor: '#F5F5F5',
//     borderColor: '#D9D9D9',
//     borderWidth: 1,
//   },
//   submitButtonActive: {
//     backgroundColor: variables.colorPrimary,
//     borderColor: variables.colorPrimary,
//   },
//   correctContainer: {
//     marginTop: variables.scale(16),
//     alignItems: 'flex-start',
//     flex: 1,
//     justifyContent: 'flex-start',
//   },
//   correctText: {
//     fontSize: variables.scale(32),
//     fontWeight: '400',
//     fontFamily: commonColor.fontFamily,
//     marginLeft: variables.scale(20),
//     color: variables.colorPrimary,
//   },
//   incorrectContainer: {
//     marginTop: variables.scale(16),
//     alignItems: 'flex-start',
//     flex: 1,
//     justifyContent: 'flex-start',
//   },
//   incorrectText: {
//     fontSize: variables.scale(32),
//     fontWeight: '400',
//     fontFamily: commonColor.fontFamily,
//     marginLeft: variables.scale(20),
//     color: 'red',
//   },
// });

// export default QuizImageMap;
