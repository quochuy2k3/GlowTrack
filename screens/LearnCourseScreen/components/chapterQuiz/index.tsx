import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import { Text, View } from 'tamagui';
import QuizTrueFalse from './components/QuizTrueFalse';
import QuizSingleton from './components/QuizSingleton/QuizSingleton';
import QuizMultiSelectOption from './components/QuizMultiSelectOption/QuizMultiSelectOption';
import QuizImage from './components/QuizImage/Quizimage';
import QuizPdf from './components/QuizPdf/QuizPdf';
import QuizText from './components/QuizText/QuizText';
import QuizSort from './components/QuizSort/QuizSort';
import QuizFill from './components/QuizFill/QuizFill';
import QuizOpinionSelectMultipleQuestion from './components/QuizOpinionSelectMultipleQuestion/QuizOpinionSelectMultipleQuestion';
import QuizDoc from './components/QuizDoc/QuizDoc';
import QuizSheet from './components/QuizSheet/QuizSheet';
import Embed from './components/Embed/Embed';
import commonColor from '@/theme/commonColor';
import variables from '@/theme/commonColor';
import BackButtonIcon from '@/assets/svgs/BackButtonIcon';
import { t } from 'i18next';
import QuizLinker from './components/QuizLinker';
import VideoContainer from '../videoContent/VideoContainer';

const ChapterQuiz = ({
  content,
  isLastItem,
  onLoadData,
  setIsLearning,
  getNextContent,
  courseId,
  mode,
  setMode,
  setContentId,
}: any) => {
  const [type, setType] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoId, setVideoId] = useState('');
  const [isCanNextQuestion, setIsCanNextQuestion] = useState(false);
  const videoType = ['youtube', 'vimeo'];

  const translateX = useRef(new Animated.Value(variables.deviceWidth)).current;
  const translateY = useRef(new Animated.Value(variables.deviceHeight)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderQuiz = () => {
    if (!content) return null;
    const { id, type } = content.contentObj || {};
    const quizProps = {
      contentDetail: content,
      courseId,
      onLoadData: onLoadData,
      setIsCanNextQuestion: setIsCanNextQuestion,
    };
    switch (type) {
      case 'BooleanQuestion':
        return <QuizTrueFalse {...quizProps} key={id} />;
      case 'SelectSingleQuestion':
        return <QuizSingleton {...quizProps} key={id} />;
      case 'SelectMultipleQuestion':
        return <QuizMultiSelectOption {...quizProps} key={id} />;
      case 'OpinionSelectMultipleQuestion':
        return <QuizOpinionSelectMultipleQuestion {...quizProps} key={id} />;
      case 'image':
        return <QuizImage {...quizProps} key={id} />;
      // case 'video':
      //   return <LectureVideo {...quizProps} />;
      case 'pdf':
        return <QuizPdf {...quizProps} key={id} />;
      case 'SortQuestion':
        return <QuizSort {...quizProps} key={id} />;
      // case 'audio':
      //   return <QuizAudio {...quizProps} />;
      case 'text':
        return <QuizText {...quizProps} key={id} />;
      case 'multiple_choice':
        return <QuizTrueFalse {...quizProps} key={id} />;
      case 'PairQuestion':
        return <QuizLinker {...quizProps} key={id} />;
      case 'FillQuestion':
        return <QuizFill {...quizProps} key={id} />;
      // case 'OpenQuestion':
      // case 'OpinionOpenQuestion':
      //   return <QuizOpenQuestion {...quizProps} />;
      case 'doc':
        return <QuizDoc {...quizProps} key={id} />;
      case 'sheet':
        return <QuizSheet {...quizProps} key={id} />;
      // case 'ImageMapQuestion':
      //   return <QuizImageMap {...quizProps} />;
      case 'embed':
        return <Embed {...quizProps} key={id} />;
      default:
        setIsLearning(false);
        setMode('');
        return null;
    }
  };

  const opacity = translateY.interpolate({
    inputRange: [0, variables.deviceHeight],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > variables.deviceHeight / 4) {
          Animated.timing(translateY, {
            toValue: variables.deviceHeight,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setMode('miniDock');
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (mode === 'fullScreen') {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [mode]);

  const extractVideoId = (url: string) => {
    const regExp =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : null;
  };

  const setDataVideo = (videoType: string, sourceUrl: string) => {
    let videoId = sourceUrl || '';

    if (videoType === 'youtube' && sourceUrl) {
      videoId = extractVideoId(sourceUrl);
    }

    setVideoId(videoId);
    setIsPlaying(true);
    setMode('fullScreen');
  };

  const onFinish = async () => {
    // try {
    //   const response = await LMS_API.submitQuestion(courseId, itemId);
    //   if (response) {
    //     onLoadData && onLoadData();
    //   }
    // } catch (e) {
    //   console.error(e);
    // }
  };

  useEffect(() => {
    if (videoType.includes(content?.contentObj?.type)) {
      onFinish(content.content);
      setDataVideo(content?.contentObj?.type, content.contentObj.sourceUrl);
      setIsCanNextQuestion(true);
      setType(content?.contentObj?.type);
    }
  }, [content]);

  const handleBack = () => {
    Animated.timing(translateY, {
      toValue: variables.deviceHeight,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (videoType.includes(content?.contentObj?.type)) {
        setMode('miniDock');
      } else {
        setMode('');
        setIsLearning(false);
        setContentId('');
      }
    });
  };

  const handleNextQuestion = async () => {
    setIsCanNextQuestion(false);
    (await getNextContent) && getNextContent();
  };

  return (
    <Animated.View
      style={[
        mode === 'fullScreen'
          ? [
              styles.containerFullScreen,
              {
                transform: [{ translateY }],
                opacity,
              },
            ]
          : styles.miniDock,
      ]}
    >
      <SafeAreaView
        style={mode === 'miniDock' ? styles.containerMiniDock : styles.containerFullScreen}
      >
        <View style={mode === 'miniDock' ? { display: 'none' } : styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <BackButtonIcon />
          </TouchableOpacity>
          <Text
            numberOfLines={1}
            fontsize-20
            color-secondary
            font-semi-bold
            style={{ textAlign: 'center' }}
          >
            123ưqeqưeqưe
            {/* {Messages[content?.type]
              ? intl.formatMessage(Messages[content?.type])
              : content?.type}{' '}
            {'-'}{' '}
            {Messages[content?.contentObj?.type]
              ? intl.formatMessage(Messages[content?.contentObj?.type])
              : content?.contentObj?.type} */}
          </Text>
        </View>
        {videoType.includes(content?.contentObj?.type) ? (
          <Animated.View
            style={mode === 'fullScreen' ? styles.videoContainer : {}}
            {...(mode === 'fullScreen' ? panResponder.panHandlers : {})}
          >
            <VideoContainer
              courseDetail={content}
              setIsLearning={setIsLearning}
              loading={false}
              mode={mode}
              videoType={type}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              setMode={setMode}
              videoId={videoId}
            />
          </Animated.View>
        ) : (
          <ScrollView style={styles.containerQuiz}>{renderQuiz()}</ScrollView>
        )}
        {isCanNextQuestion && mode === 'fullScreen' && (
          <View style={styles.submitButtonContainer}>
            <TouchableOpacity
              onPress={handleNextQuestion}
              style={[styles.submitButton, styles.submitButtonActive]}
            >
              <Text style={[styles.submitButtonText, styles.submitButtonTextActive]}>
                {isLastItem ? t('complete_task') : t('next_question')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  miniDock: {
    flex: 1,
  },
  containerFullScreen: {
    zIndex: 1000,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'white',
  },

  containerQuiz: {
    flexDirection: 'column',
    padding: variables.scale(40),
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: variables.scale(20),
    paddingLeft: variables.scale(40),
    borderBottomWidth: 1,
    borderColor: '#D6D8E0',
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: variables.scale(40),
  },
  backButton: {
    position: 'absolute',
    left: -1,
    top: 10,
    paddingHorizontal: variables.scale(20),
    paddingVertical: variables.scale(10),
  },

  submitButtonContainer: {
    paddingVertical: variables.scale(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: '#D6D8E0',
    paddingHorizontal: variables.scale(40),
    marginBottom: variables.scale(25),
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: variables.scale(30),
    paddingVertical: variables.scale(24),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFBFBF',
  },
  submitButtonText: {
    fontSize: variables.scale(36),
    fontWeight: '600',
    fontFamily: commonColor.fontFamily,
    color: '#BFBFBF',
  },
  videoContainer: {
    flex: 1,
  },
  submitButtonActive: {
    backgroundColor: '#1ECC78',
    borderColor: '#1ECC78',
    borderWidth: 1,
  },
  submitButtonTextActive: {
    color: '#FFFFFF',
  },
});

export default ChapterQuiz;
