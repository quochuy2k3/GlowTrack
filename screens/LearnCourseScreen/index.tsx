import { services } from '@/services';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { t } from 'i18next';
import commonColor from '@/theme/commonColor';
import variables from '@/theme/commonColor';
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
  Animated,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Image, Spinner } from 'tamagui';
import Content from './components/Content';
import ChapterQuiz from './components/chapterQuiz';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

type LearnCourseScreenProps = {
  id: string;
};

export default function LearnCourseScreen({ id }: LearnCourseScreenProps) {
  const nav = useNavigation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tabActive, setTabActive] = useState('content');
  const [listContent, setListContent] = useState<any[]>([]);
  const [isLearning, setIsLearning] = useState(false);
  const [content, setContent] = useState<any>(null); // Add type annotation
  const [contentId, setContentId] = useState<string | null>(null); // Add type annotation
  const [isLastItem, setIsLastItem] = useState(false);
  const [mode, setMode] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current;
  const tabsData = {
    content: {
      titleMessage: t('content'),
    },
    // QA: {
    //   titleMessage: Messages.qa,
    // },
  };

  useEffect(() => {
    if (listContent && listContent.length > 0 && content) {
      setIsLastItem(content.content === listContent[listContent.length - 1].content);
    }
  }, [listContent, content]);
  useEffect(() => {
    if (contentId) {
      getDetailContent();
    }
  }, [contentId]);

  useEffect(() => {
    nav.setOptions({ headerShown: mode === 'fullScreen' ? false : true });
  }, [mode]);

  const handleTabPress = (tabKey: string) => {
    const toValue = tabKey === 'content' ? 0 : width / 2;
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
    }).start();
    setTabActive(tabKey);
  };

  const onLoadData = async () => {
    try {
      setLoading(true);
      const response = await services.UserCourseService.findContents(id);
      if (response) {
        setListContent(response);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (tabActive) {
      case 'content':
        return (
          <Content
            setIsLearning={setIsLearning}
            setContentId={setContentId}
            setListContent={setListContent}
            setMode={setMode}
            courseId={id}
            contentId={contentId}
          />
        );
      case 'QA':
        return null;
      default:
        return null;
    }
  };

  const onAsk = () => {};

  const getNextContent = async () => {
    if (!listContent || listContent.length === 0 || !content) {
      setIsLearning(false);
      return;
    }

    const currentIndex = listContent.findIndex(item => item.content === content.content);

    if (currentIndex === -1 || isLastItem) {
      setIsLearning(false);
      return;
    }

    setContentId(listContent[currentIndex + 1].content);
  };

  const getDetailContent = async () => {
    if (!id || !contentId) return;
    try {
      const response = await services.UserCourseService.getCourseContent(id, contentId);
      if (response) {
        setMode('fullScreen');
        setContent(response);
        setIsLearning(true);
      }
    } catch (error) {
      console.error('Error getting detail content:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.tabBarContainer}>
          <View style={styles.tabBar}>
            {Object.keys(tabsData).map(tabKey => (
              <TouchableOpacity
                key={tabKey}
                onPress={() => handleTabPress(tabKey)}
                style={[styles.tabButton, tabActive === tabKey && { backgroundColor: '#f0f0f0' }]}
              >
                <Text style={[styles.tabText, tabActive === tabKey && styles.tabTextActive]}>
                  {tabsData[tabKey as keyof typeof tabsData].titleMessage}
                </Text>
              </TouchableOpacity>
            ))}
            <Animated.View
              style={[
                styles.slider,
                {
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            />
          </View>
        </View>
        <ScrollView style={styles.wrapperContent}>
          {loading ? <Spinner /> : renderContent()}
        </ScrollView>
        {tabActive === 'QA' && mode === 'fullScreen' && (
          <TouchableOpacity style={styles.askButton} onPress={onAsk}>
            <Image source={require('@/assets/images/CommentWhite.png')} />
            <Text style={styles.askButtonText}>{t('ask')}</Text>
          </TouchableOpacity>
        )}
      </View>
      {isLearning && (
        <View
          style={
            mode === 'miniDock'
              ? styles.learningContainerMiniDock
              : styles.learningContainerFullScreen
          }
        >
          <ChapterQuiz
            isLastItem={isLastItem}
            content={content}
            onLoadData={onLoadData}
            setIsLearning={setIsLearning}
            getNextContent={getNextContent}
            mode={mode}
            setMode={setMode}
            courseId={id}
            setContentId={setContentId}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    flex: 1,
    flexDirection: 'column',
  },
  tabBarContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
    backgroundColor: '#FFFFFF',
  },
  tabBar: {
    flexDirection: 'row',
    height: variables.scale(88),
    position: 'relative',
  },
  tabButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 3,
    backgroundColor: variables.colorPrimary,
  },
  tabText: {
    fontSize: variables.scale(32),
    textAlign: 'center',
    fontWeight: '700',
    fontFamily: commonColor.fontFamily,
    color: '#666666',
  },
  tabTextActive: {
    color: variables.colorPrimary,
  },
  wrapperContent: {
    flexDirection: 'column',
    zIndex: 1,
  },
  toggleText: {
    fontSize: variables.scale(20),
    color: '#FFFFFF',
    backgroundColor: '#2196F3',
    padding: variables.scale(10),
    borderRadius: variables.scale(5),
    textAlign: 'center',
  },
  askButton: {
    position: 'absolute',
    bottom: height > 800 ? variables.scale(70) : variables.scale(70),
    right: width > 400 ? variables.scale(60) : variables.scale(60),
    backgroundColor: variables.colorPrimary,
    paddingHorizontal: width > 400 ? variables.scale(26) : variables.scale(20),
    paddingVertical: height > 800 ? variables.scale(16) : variables.scale(12),
    borderRadius: variables.scale(48),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    flexDirection: 'row',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  learningContainerFullScreen: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  learningContainerMiniDock: {
    zIndex: 1000,
    elevation: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 40,
  },
  askButtonText: {
    color: '#fff',
    fontSize: width > 400 ? variables.scale(32) : variables.scale(28),
    fontWeight: '600',
    marginLeft: variables.scale(20),
    textAlign: 'center',
  },
});
