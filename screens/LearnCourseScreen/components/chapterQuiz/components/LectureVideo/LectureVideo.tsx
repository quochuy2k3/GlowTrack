// import React, { useState, useEffect, useContext } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   TouchableOpacity,
//   PermissionsAndroid,
//   Alert,
//   Platform,
// } from 'react-native';
// import RNFS from 'react-native-fs';
// import RNFetchBlob from 'rn-fetch-blob';
// import Share from 'react-native-share';
// import { getCachedPath, getCachedDocumentPath } from '@src/utils/common';
// import Messages from '@src/translations/Messages';
// import { IntlContext } from '@src/components/application/systemProvider';
// const LectureVideo = ({ contentDetail, setIsCanNextQuestion, onLoadData }) => {
//   const intl = useContext(IntlContext);

//   const { contentObj } = contentDetail;
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [downloadPath, setDownloadPath] = useState(null);
//   useEffect(() => {
//     setIsCanNextQuestion(true);
//     onLoadData && onLoadData();
//   }, []);

//   const requestStoragePermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true;
//   };

//   const downloadVideo = async () => {
//     try {
//       const hasPermission = await requestStoragePermission();
//       if (!hasPermission) {
//         Alert.alert(
//           intl.formatMessage(Messages.permission_denied),
//           intl.formatMessage(Messages.storage_permission_required),
//         );
//         return;
//       }

//       setIsDownloading(true);
//       const fileName = `${
//         contentObj?.sourceUrl.split('/').slice(-1)[0].split('.')[0]
//       }.mov`;
//       const tempPath = getCachedDocumentPath() + `/${fileName}`;

//       const res = await RNFetchBlob.config({
//         fileCache: true,
//         path: tempPath,
//       }).fetch('GET', contentObj?.sourceUrl);

//       let finalPath = tempPath;

//       if (Platform.OS === 'android') {
//         const downloadDir = `${RNFS.DownloadDirectoryPath}/${fileName}`;
//         await RNFS.moveFile(tempPath, downloadDir);
//         finalPath = downloadDir;
//       } else {
//         await Share.open({
//           title: intl.formatMessage(Messages.save_video),
//           url: `file://${tempPath}`,
//           type: 'video/quicktime',
//         });
//       }

//       setIsDownloading(false);
//       setDownloadPath(finalPath);
//       Alert.alert(
//         intl.formatMessage(Messages.download_successful),
//         intl.formatMessage(Messages.download_successful_message),
//       );
//     } catch (err) {
//       setIsDownloading(false);
//       Alert.alert(
//         intl.formatMessage(Messages.download_failed),
//         intl.formatMessage(Messages.download_failed_message),
//       );
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <Text style={styles.sectionTitle}>{contentObj?.title}</Text>

//         <TouchableOpacity
//           onPress={downloadVideo}
//           disabled={isDownloading}
//           style={styles.button}>
//           <Text style={styles.textButton}>
//             {isDownloading
//               ? intl.formatMessage(Messages.downloading_file)
//               : intl.formatMessage(Messages.download)}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   content: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#1A202C',
//     marginBottom: 16,
//   },
//   button: {
//     width: '100%',
//     alignItems: 'center',
//     padding: 15,
//     backgroundColor: '#007AFF',
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   textButton: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });

// export default LectureVideo;
