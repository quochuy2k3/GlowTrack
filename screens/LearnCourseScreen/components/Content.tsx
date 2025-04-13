import React, { useState, useEffect, useContext } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  UIManager,
  Image,
  LayoutAnimation,
} from 'react-native';
import variables from '@/theme/commonColor';
import ArrowBottom from '@/assets/svgs/ArrowBottom';
import { Spinner } from 'tamagui';
import { t } from 'i18next';
import { services } from '@/services';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Content = ({
  setIsLearning,
  setContentId,
  setListContent,
  courseId,
  setMode,
  contentId,
}: any) => {
  const [expandedChapters, setExpandedChapters] = useState(new Set());
  const [courseSection, setCourseSection] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [courseContent, setCourseContent] = useState([]);
  const [metaCourseContent, setMetaCourseContent] = useState({});
  const handleGetSectionCourse = async () => {
    try {
      setLoading(true);
      const response = await services.CourseSectionService.find({ course: courseId });
      if (response) {
        setCourseSection(response);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGetContentCourse = async () => {
    try {
      setIsLoading(true);
      const response = await services.UserCourseService.findContents(courseId);
      if (response) {
        setCourseContent(response);
        setListContent(response);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      handleGetContentCourse();
      handleGetSectionCourse();
    }
  }, [courseId]);

  useEffect(() => {
    if (courseSection[0]) {
      toggleSection(courseSection[0]?.id);
    }
  }, [courseSection]);

  useEffect(() => {
    if (courseSection.length > 0) {
      const expandedSet = new Set(courseSection.map(section => section.id));
      setExpandedChapters(expandedSet);
    }
  }, [courseSection]);

  const toggleSection = (sectionId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedChapters(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const renderContents = (content: any) => {
    return (
      <TouchableOpacity
        key={content?.id}
        onPress={() => {
          if (contentId === content?.content) {
            setMode('fullScreen');
            setIsLearning(true);
          } else {
            setContentId(content?.content);
          }
        }}
      >
        <View style={styles.lessonItem}>
          <View style={styles.radioContainer}>
            {content?.isFinished ? (
              <Image source={require('@/assets/images/Check.png')} />
            ) : (
              <Image source={require('@/assets/images/CicleCheck.png')} />
            )}
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.lessonTitle}>{content?.title}</Text>
            {content?.type === 'lecture' ? (
              <View>
                <Text style={styles.duration}>{t(content?.type)}</Text>
              </View>
            ) : (
              <View>
                {content?.contentType !== 'question' ? (
                  <Text style={styles.duration}>
                    {t('question')} : {t(content?.contentType)}
                  </Text>
                ) : (
                  <Text style={styles.duration}>
                    {t('question')} :{' '}
                    {t(content?.contentTypeExplanation) || content?.contentTypeExplanation}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSections = (section: any, idx: number) => {
    const sectionContent = courseContent.filter((content: any) => content.section === section.id);

    const isExpanded = expandedChapters.has(section.id);

    return (
      <View key={section.id} style={styles.chapter}>
        <TouchableOpacity
          style={styles.chapterHeader}
          onPress={() => toggleSection(section.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.chapterTitle}>
            {idx + 1}. {section?.name}
          </Text>
          <View style={styles.arrowContainer}>
            <ArrowBottom width={39} height={39} />
          </View>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.lessonsContainer}>
            {isLoading ? (
              <Spinner />
            ) : sectionContent?.length > 0 ? (
              sectionContent?.map(content => renderContents(content))
            ) : (
              <Text style={styles.noContentText}>{t('no_data')}</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  if (loading) return <Spinner />;

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        {courseSection.length > 0 ? (
          courseSection.map((section, idx) => renderSections(section, idx))
        ) : (
          <Text style={styles.noDataText}>{t('no_data')}</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  chapter: {
    borderBottomColor: '#D9D9D9',
    paddingHorizontal: variables.scale(40),
    paddingVertical: variables.scale(20),
    borderBottomWidth: 1,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: variables.scale(16),
  },
  chapterTitle: {
    fontSize: variables.scale(30),
    fontWeight: 'bold',
    color: '#000000',
  },
  arrowContainer: {
    width: variables.scale(48),
    height: variables.scale(48),
  },
  lessonsContainer: {
    overflow: 'hidden',
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: variables.scale(20),
  },
  radioContainer: {
    marginRight: variables.scale(24),
  },
  contentContainer: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: variables.scale(28),
    fontWeight: '300',
    color: '#000000',
    marginBottom: variables.scale(8),
  },
  duration: {
    fontSize: variables.scale(28),
    color: '#757575',
  },
  noContentText: {
    fontSize: variables.scale(24),
    color: '#757575',
    paddingVertical: variables.scale(16),
  },
  noDataText: {
    fontSize: variables.scale(28),
    color: '#757575',
    textAlign: 'center',
    marginVertical: variables.scale(20),
  },
  outerContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: variables.scale(200),
  },
});

export default Content;
