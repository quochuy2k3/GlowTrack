// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   TextInput,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
// } from 'react-native';
// import variables from '@theme/variables/commonColor';
// import React, { useContext, useState } from 'react';
// import * as utils from '@src/utils';
// import Messages from '@src/translations/Messages';
// import { IntlContext } from '@src/components/application/systemProvider';
// import LMS_API from '../../../api/myElearning/api';
// import DocumentPicker from '@src/components/ui/inputItem/DocumentPicker';
// import commonColor from '@theme/variables/commonColor';
// import { postRequest } from '@src/utils/request';
// import serverConfig from '@src/configs/server.config';
// import { useEffect } from 'react';
// import FileIcon from '@/assets/svgs/FileIcon';
// import { WebView } from 'react-native-webview';

// const QuizOpenQuestion = ({
//   contentDetail,
//   courseId,
//   onLoadData,
//   setIsCanNextQuestion,
// }: any) => {
//   const [contentDetailQuiz, setContentDetailQuiz] = useState(contentDetail);
//   const [answer, setAnswer] = useState('');
//   const intl = useContext(IntlContext);
//   const [files, setFiles] = useState([]);

//   const handleFileChange = (newFiles) => {
//     setFiles(newFiles);
//   };

//   const checkCanSubmit = () => {
//     const responseType = contentDetail?.contentObj?.content?.responseType;

//     if (
//       ['document', 'textAndDocument'].includes(responseType) &&
//       files.length > 0
//     ) {
//       return true;
//     }

//     if (
//       ['text', 'textAndDocument'].includes(responseType) &&
//       answer.trim() !== ''
//     ) {
//       return true;
//     }

//     return false;
//   };

//   const handleButton = async () => {
//     if (contentDetailQuiz.userAnswers) {
//       setContentDetailQuiz({
//         ...contentDetailQuiz,
//         userAnswers: null,
//       });
//       setAnswer('');
//       setFiles([]);
//       setIsCanNextQuestion(false);
//     } else {
//       try {
//         if (
//           ['document', 'textAndDocument'].includes(
//             contentDetail?.contentObj?.content?.responseType,
//           )
//         ) {
//           const document = await uploadEDocuments(files);
//           setFiles(document);
//           await handleSubmit(document);
//         }
//         if (
//           ['text'].includes(contentDetail?.contentObj?.content?.responseType)
//         ) {
//           await handleSubmit([]);
//         }
//       } catch (error) {
//         console.error('Error uploading files:', error);
//         showBriefMessage('File upload failed. Please try again.');
//       }
//     }
//   };

//   const uploadEDocuments = async (files) => {
//     if (!files || files.length === 0) {
//       throw new Error('No files provided for upload');
//     }
//     const updatedDocument = [];
//     const promises = files.map(async (file) => {
//       try {
//         if (!file.path || !file.filename || !file.mime) {
//           console.error('Invalid file metadata:', file);
//           return;
//         }
//         const builtFile = await utils.buildFile(
//           file.filename,
//           file.path,
//           file.mime,
//         );
//         const formUploadFile = new FormData();
//         formUploadFile.append('file', builtFile);
//         formUploadFile.append('from', 'smartca');
//         const res = await postRequest(
//           `${serverConfig.API_DOMAIN}media/api/v1/upload`,
//           formUploadFile,
//         );
//         updatedDocument.push(res.data.url);
//       } catch (err) {
//         console.error('Error in file upload:', err);
//       }
//     });

//     await Promise.all(promises);
//     return updatedDocument;
//   };

//   const handleSubmit = async (filesUrl) => {
//     const answerText = `<p>${answer}</p>`;
//     const response = await LMS_API.submitOpenQuestion(
//       courseId,
//       contentDetail?.content,
//       answerText,
//       filesUrl,
//       contentDetail?.contentObj?.type,
//     );
//     if (response) {
//       setContentDetailQuiz({
//         ...contentDetailQuiz,
//         userAnswers: response?.userAnswers,
//       });
//       onLoadData && onLoadData();
//       setIsCanNextQuestion(true);
//     }
//   };

//   useEffect(() => {
//     setAnswer(
//       contentDetailQuiz.userAnswers?.answers?.answer
//         ? contentDetailQuiz.userAnswers.answers.answer.replace(
//             /^<p>|<\/p>$/g,
//             '',
//           )
//         : '',
//     );
//     setFiles(contentDetailQuiz.userAnswers?.answers?.answerDocument || []);
//     setIsCanNextQuestion(contentDetailQuiz.userAnswers ? true : false);
//   }, [contentDetailQuiz]);

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}>
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <SafeAreaView style={styles.innerContainer}>
//           <Text style={styles.titleText}>
//             {contentDetailQuiz.contentObj.question}
//           </Text>
//           <Text style={styles.subTitleText}>
//             {intl.formatMessage(
//               ['document'].includes(
//                 contentDetail?.contentObj?.content?.responseType,
//               )
//                 ? Messages.answer_by_posting_a_document
//                 : ['text'].includes(
//                     contentDetail?.contentObj?.content?.responseType,
//                   )
//                 ? Messages.answer_by_using_the_text_editor
//                 : Messages.answer_by_posting_a_document_or_using_the_text_editor,
//             )}
//           </Text>
//           {['document', 'textAndDocument'].includes(
//             contentDetail?.contentObj?.content?.responseType,
//           ) && (
//             <>
//               {contentDetailQuiz.userAnswers ? (
//                 <View style={styles.fileContainer}>
//                   <Text style={styles.textAreaLabel}>
//                     {intl.formatMessage(Messages.documents)}
//                   </Text>
//                   <View style={styles.fileRow}>
//                     {contentDetailQuiz.userAnswers?.answers?.answerDocument?.map(
//                       (item, index) => (
//                         <View style={styles.fileRowItem} key={index}>
//                           <FileIcon width={40} height={40} />
//                           <Text style={styles.fileRowItemText}>
//                             {intl.formatMessage(Messages.document)} {index + 1}
//                           </Text>
//                         </View>
//                       ),
//                     )}
//                   </View>
//                 </View>
//               ) : (
//                 <DocumentPicker
//                   label={intl.formatMessage(Messages.documents)}
//                   callbackChangeFiles={handleFileChange}
//                 />
//               )}
//             </>
//           )}
//           {['text', 'textAndDocument'].includes(
//             contentDetail?.contentObj?.content?.responseType,
//           ) && (
//             <View style={styles.textAreaContainer}>
//               <Text style={styles.textAreaLabel}>
//                 {intl.formatMessage(Messages.answer)}
//               </Text>
//               {!contentDetailQuiz.userAnswers ? (
//                 <TextInput
//                   style={styles.textArea}
//                   placeholder={intl.formatMessage(
//                     Messages.write_your_answer_here,
//                   )}
//                   placeholderTextColor="#A9A9A9"
//                   multiline={true}
//                   textAlignVertical="top"
//                   value={answer}
//                   onChangeText={(text) => setAnswer(text)}
//                   autoFocus={false}
//                 />
//               ) : (
//                 <WebView
//                   originWhitelist={['*']}
//                   source={{
//                     html: `
//                       <html>
//                         <head>
//                           <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
//                           <style>
//                             body { 
//                               min-height: ${variables.scale(400)}px;
//                               font-size: ${variables.scale(30)}px; 
//                               background-color: #F2F7FF; 
//                               color: #000; 
//                               padding: ${variables.scale(20)}px;
//                               border-radius: ${variables.scale(10)}px;
//                               text-align: left;
//                               font-family: Arial, sans-serif;
//                             }
//                             strong { color: black; } 
//                           </style>
//                         </head>
//                         <body>
//                           ${contentDetailQuiz.userAnswers?.answers?.answer}
//                         </body>
//                       </html>
//                     `,
//                   }}
//                   style={{
//                     minHeight: variables.scale(400),
//                     width: '100%',
//                     backgroundColor: '#F2F7FF',
//                   }}
//                 />
//               )}
//             </View>
//           )}

//           <TouchableOpacity
//             style={[
//               styles.submitButton,
//               checkCanSubmit() && styles.submitButtonActive,
//               contentDetailQuiz.userAnswers && styles.submitButtonActive,
//             ]}
//             onPress={() => {
//               handleButton();
//             }}
//             disabled={!checkCanSubmit() && !contentDetailQuiz.userAnswers}>
//             <Text
//               style={[
//                 styles.submitButtonText,
//                 checkCanSubmit() && styles.submitButtonTextActive,
//                 contentDetailQuiz.userAnswers && styles.submitButtonTextActive,
//               ]}>
//               {contentDetailQuiz.userAnswers
//                 ? intl.formatMessage(Messages.retry)
//                 : intl.formatMessage(Messages.submit)}
//             </Text>
//           </TouchableOpacity>
//         </SafeAreaView>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   innerContainer: {
//     flex: 1,
//     padding: Platform.OS === 'ios' ? variables.scale(32) : variables.scale(0),
//   },
//   titleText: {
//     fontSize: variables.scale(32),
//     fontWeight: '600',
//     fontFamily: variables.fontFamily,
//   },
//   subTitleText: {
//     fontSize: variables.scale(32),
//     color: '#8C8C8C',
//     marginTop: variables.scale(32),
//     marginBottom: variables.scale(50),
//     fontFamily: variables.fontFamily,
//   },
//   textAreaContainer: {
//     marginTop: variables.scale(32),
//   },
//   textAreaLabel: {
//     fontSize: variables.scale(30),
//     fontWeight: '400',
//     fontFamily: variables.fontFamily,
//     color: '#8793B4',
//     marginBottom: variables.scale(6),
//     marginTop: variables.scale(40),
//   },
//   textArea: {
//     padding: variables.scale(30),
//     paddingTop: variables.scale(30),
//     backgroundColor: '#F2F7FF',
//     borderRadius: variables.scale(10),
//     minHeight: variables.scale(400),
//     fontSize: variables.scale(32),
//     maxHeight: variables.scale(700),
//     fontWeight: '400',
//     fontFamily: variables.fontFamily,
//     color: '#000',
//     textAlign: 'left',
//     textAlignVertical: 'top',
//   },
//   submitButton: {
//     marginTop: variables.scale(100),
//     backgroundColor: '#F5F5F5',
//     borderRadius: variables.scale(30),
//     paddingVertical: variables.scale(24),
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: '#BFBFBF',
//     marginBottom: variables.scale(30),
//   },
//   submitButtonText: {
//     fontSize: variables.scale(36),
//     fontWeight: '600',
//     fontFamily: commonColor.fontFamily,
//     color: '#BFBFBF',
//   },
//   submitButtonActive: {
//     backgroundColor: '#1ECC78',
//     borderColor: '#1ECC78',
//     borderWidth: 1,
//   },
//   submitButtonTextActive: {
//     color: '#FFFFFF',
//   },
//   fileRow: {
//     marginTop: variables.scale(10),
//     flexDirection: 'row',
//     alignItems: 'center',
//     flexWrap: 'wrap',
//   },
//   fileRowItem: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: variables.scale(25),
//   },
//   fileRowItemText: {
//     fontSize: variables.scale(24),
//     fontWeight: '400',
//     fontFamily: commonColor.fontFamily,
//     color: '#000',
//   },
//   next_question: {
//     borderRadius: variables.scale(30),
//     marginTop: variables.scale(46),
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: variables.scale(24),
//     flexDirection: 'row',
//     backgroundColor: variables.colorPrimary,
//   },
//   text_next_question: {
//     color: '#ffffff',
//     fontSize: variables.scale(32),
//     fontWeight: '600',
//   },
// });

// export default QuizOpenQuestion;
