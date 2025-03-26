import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import IconTrueText from '@/assets/svgs/trueTextIcon';
import IconFalseText from '@/assets/svgs/falseTextIcon';
import commonColor from '@/theme/commonColor';
import variables from '@/theme/commonColor';
import { t } from 'i18next';

// import LMS_API from '../../api/ms/api';

const QuizFill = ({ contentDetail, courseId, onLoadData, setIsCanNextQuestion }: any) => {
  const [contentDetailQuiz, setContentDetailQuiz] = useState(contentDetail);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState();
  const decodedText = decodeURIComponent(contentDetailQuiz.contentObj.content.text)
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '');
  const partsInitial = decodedText.split(/(\[\[.*?\]\])/);
  const [inputs, setInputs] = useState({});
  useEffect(() => {
    setInputs(processAnswersWithDetails(contentDetailQuiz));
  }, []);

  const processAnswersWithDetails = (contentDetailQuiz: any) => {
    let initialInputs = {};
    if (contentDetailQuiz.userAnswers) {
      setIsCanNextQuestion(true);
      const decodedCorrectText = decodeURIComponent(
        contentDetailQuiz.userAnswers.correctAnswers.text
      ).replace(/<p>|<\/p>/g, '');
      const decodedUserText = decodeURIComponent(
        contentDetailQuiz.userAnswers.answers.text
      ).replace(/<p>|<\/p>/g, '');
      const cleanedText = decodedCorrectText.replace(/\[\[.*?\]\]/g, '');

      const parts = cleanedText.split(/\s+/).filter(word => word.trim() !== '');
      const userWordsArray = decodedUserText.split(/\s+/).filter(word => word.trim() !== '');

      let differences = [];
      let tempGroup = '';
      let i = 0,
        j = 0;

      while (i < parts.length && j < userWordsArray.length) {
        if (parts[i] === userWordsArray[j] && tempGroup.trim()) {
          if (j + 1 < userWordsArray.length && parts[i] === userWordsArray[j + 1]) {
            tempGroup += userWordsArray[j] + ' ';
            j++;
          } else {
            differences.push(tempGroup.trim());
            tempGroup = '';
          }
        }

        if (parts[i] === userWordsArray[j]) {
          i++;
          j++;
        } else {
          tempGroup += userWordsArray[j] + ' ';
          j++;
        }
      }

      while (j < userWordsArray.length) {
        tempGroup += userWordsArray[j] + ' ';
        j++;
      }
      if (tempGroup.trim()) {
        differences.push(tempGroup.trim());
      }
      const keys = partsInitial
        .filter(part => part.startsWith('[[') && part.endsWith(']]'))
        .map(key => key.slice(2, -2).trim());

      const inputs = {};
      keys.forEach((key, index) => {
        const value = differences[index] || null;
        const consequence = value === null ? null : key.toLowerCase() === value.toLowerCase();
        inputs[key] = {
          value,
          consequence,
        };
      });
      let isAnswerCorrect = true;
      Object.values(inputs).forEach(input => {
        if (input.consequence === false) {
          isAnswerCorrect = false;
        }
      });
      setIsAnswerCorrect(isAnswerCorrect);
      initialInputs = inputs;
    }
    return initialInputs;
  };

  const handleInputChange = (key, value) => {
    setInputs(prev => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));
  };

  const checkCanSubmit = () => {
    return (
      Object.keys(inputs).length > 0 &&
      Object.values(inputs).every(input => input.value.trim() !== '')
    );
  };

  const handleStyleAnswer = key => {
    if (inputs[key]?.consequence === true) {
      return styles.trueAnswer;
    } else if (inputs[key]?.consequence === false) {
      return styles.falseAnswer;
    }
    return {};
  };

  const handleButton = () => {
    if (contentDetailQuiz.userAnswers) {
      contentDetailQuiz.userAnswers = null;
      setContentDetailQuiz({ ...contentDetailQuiz, userAnswers: null });
      setIsCanNextQuestion(false);
      setInputs({});
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const replacePlaceholders = (parts, inputs) => {
      return parts.map(part => {
        const match = part.match(/\[\[(.*?)\]\]/);
        if (match) {
          const key = match[1];
          if (inputs[key]) {
            return part.replace(`[[${key}]]`, inputs[key].value);
          }
        }
        return part;
      });
    };

    const updatedParts = replacePlaceholders(partsInitial, inputs);
    const combinedString = updatedParts.join('');
    const text = encodeURIComponent(`<p>${combinedString}</p>`);
    // const response = await LMS_API.submitQuestionFill(
    //   courseId,
    //   contentDetail?.content,
    //   text,
    //   contentDetail?.contentObj?.type
    // );
    const response = {
      userAnswers: {
        correctAnswers: { text: 'correct answer' },
        answers: { text: 'user answer' },
      },
    };
    if (response) {
      onLoadData && onLoadData();
      setContentDetailQuiz({
        ...contentDetailQuiz,
        userAnswers: response?.userAnswers,
      });
      setInputs(processAnswersWithDetails(response));
      setIsCanNextQuestion(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>{contentDetailQuiz.contentObj.question}</Text>
      <Text style={styles.subTitleText}>
        {t('fill_in_the_blanks_by_writing_the_missing_words')}
      </Text>
      <View style={styles.textContainer}>
        {partsInitial.map((part, index) => {
          if (part.startsWith('[[') && part.endsWith(']]')) {
            const key = part.slice(2, -2);
            return (
              <>
                <TextInput
                  key={index}
                  style={[styles.input, handleStyleAnswer(key)]}
                  editable={contentDetailQuiz.userAnswers ? false : true}
                  value={inputs[key]?.value || ''}
                  onChangeText={value => handleInputChange(key, value)}
                />
                {inputs[key]?.consequence === false && (
                  <TextInput
                    key={index}
                    style={[styles.input, styles.trueAnswer]}
                    value={key}
                    editable={false}
                  />
                )}
              </>
            );
          } else {
            const words = part.split(' ');
            return words.map((word, wordIndex) => (
              <Text key={`${index}-${wordIndex}`} style={styles.text}>
                {word}{' '}
              </Text>
            ));
          }
        })}
      </View>
      <TouchableOpacity
        style={[
          styles.submitButton,
          checkCanSubmit() && styles.submitButtonActive,
          contentDetailQuiz.userAnswers && styles.submitButtonActive,
        ]}
        onPress={() => {
          handleButton();
        }}
        disabled={!checkCanSubmit() && !contentDetailQuiz.userAnswers}
      >
        <Text
          style={[
            styles.submitButtonText,
            checkCanSubmit() && styles.submitButtonTextActive,
            contentDetailQuiz.userAnswers && styles.submitButtonTextActive,
          ]}
        >
          {contentDetailQuiz.userAnswers ? t('retry') : t('submit')}
        </Text>
      </TouchableOpacity>
      {contentDetailQuiz.userAnswers && (
        <>
          <View style={styles.resultContainer}>
            <View style={styles.resultTextContainer}>
              {isAnswerCorrect ? (
                <IconTrueText width={17} height={17} />
              ) : (
                <IconFalseText width={17} height={17} />
              )}
              <Text
                style={[
                  styles.resultText,
                  isAnswerCorrect ? { color: '#1ECC78' } : { color: '#FF0E39' },
                ]}
              >
                {isAnswerCorrect ? t('correct_answer') : t('your_answer_was_incorrect')}
              </Text>
            </View>
            <Text style={styles.feedbackTitleText}>{t('feedback')}</Text>
            <Text style={styles.feedbackText}>
              Object-oriented programming languages include Java, Python, C++, Ruby, C#, and many
              others.{' '}
            </Text>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === 'ios' ? variables.scale(32) : variables.scale(0),
    backgroundColor: '#fff',
  },
  titleText: {
    fontSize: variables.scale(32),
    fontWeight: '600',
    fontFamily: variables.fontFamily,
  },
  subTitleText: {
    fontSize: variables.scale(32),
    color: '#8C8C8C',
    marginTop: variables.scale(32),
    marginBottom: variables.scale(60),

    fontFamily: variables.fontFamily,
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: '#F2F7FF',
    padding: variables.scale(32),
    borderRadius: variables.scale(20),
  },
  text: {
    fontSize: variables.scale(32),
    flexShrink: 1,
    fontWeight: '400',
    fontFamily: variables.fontFamily,
    lineHeight: variables.scale(50),
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 4,
    fontSize: variables.scale(32),
    minWidth: variables.scale(150),
    flexShrink: 1,
    fontFamily: variables.fontFamily,
    lineHeight: variables.scale(40),
    paddingHorizontal: variables.scale(16),
    textAlign: 'center',
    borderRadius: variables.scale(20),
    marginBottom: variables.scale(5),
    paddingVertical: variables.scale(5),
    backgroundColor: '#fff',
    fontWeight: '600',
    borderWidth: 1,
  },
  submitButton: {
    marginTop: variables.scale(70),
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
  submitButtonActive: {
    backgroundColor: '#1ECC78',
    borderColor: '#1ECC78',
    borderWidth: 1,
  },
  submitButtonTextActive: {
    color: '#FFFFFF',
  },
  resultContainer: {
    marginTop: variables.scale(40),
    marginBottom: variables.scale(100),
  },
  resultTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultText: {
    fontSize: variables.scale(32),
    fontWeight: '400',
    fontFamily: commonColor.fontFamily,
    marginLeft: variables.scale(20),
  },
  feedbackTitleText: {
    fontSize: variables.scale(32),
    fontWeight: '600',
    fontFamily: commonColor.fontFamily,
    color: '#000000',
    marginTop: variables.scale(60),
  },
  feedbackText: {
    fontSize: variables.scale(32),
    fontWeight: '400',
    fontFamily: commonColor.fontFamily,
    color: '#000000',
    marginTop: variables.scale(16),
  },
  trueAnswer: {
    backgroundColor: '#1ECC78',
    color: '#fff',
  },
  falseAnswer: {
    backgroundColor: '#FFE7EB',
    color: '#FF3E61',
    borderColor: '#FF3E61',
    textDecorationLine: 'line-through',
  },
});

export default QuizFill;
