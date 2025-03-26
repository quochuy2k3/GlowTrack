import React, { useContext, useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { t } from 'i18next';
import IconTrue from '@/assets/svgs/trueIcon';
import IconFalse from '@/assets/svgs/falseIcon';
import useFetchQuizLinker from './useFecthQuizLinker';
// import { useDispatch } from "react-redux";
import commonColor from '@/theme/commonColor';
import variables from '@/theme/commonColor';
import IconTrueText from '@/assets/svgs/trueTextIcon';
import IconFalseText from '@/assets/svgs/falseTextIcon';
const QuizLinker = ({ contentDetail, courseId, onLoadData, setIsCanNextQuestion }: any) => {
  const { loading, linkOptions, options, setAnswer, button, handleButton, answerFeedback } =
    useFetchQuizLinker(contentDetail, courseId, onLoadData, setIsCanNextQuestion);
  const [check, setCheck] = useState({
    answer: [],
    linkAnswer: [],
  });

  useEffect(() => {
    const chosenOptions = linkOptions.filter(option => option.chose && option.linkId);
    const check = {
      answer: chosenOptions?.map(option => option.linkId) || [],
      linkAnswer: chosenOptions?.map(option => option.id) || [],
    };
    setCheck(check);
  }, [linkOptions]);
  const Option = ({ option }) => {
    const { content, chose, consequence, trueColor, choseColor } = option;

    const getOptionStyle = () => {
      if (consequence === false) return { backgroundColor: '#FFE7EB', borderColor: '#FF0E39' };
      if (consequence === true) return { backgroundColor: trueColor, borderColor: trueColor };
      if (chose) {
        return {
          backgroundColor: choseColor,
          borderColor: trueColor,
        };
      }
      return {};
    };

    const textColor = consequence === false ? '#FF0E39' : consequence ? '#FFFFFF' : '#000000';

    return (
      <TouchableOpacity
        style={[styles.optionDefault, getOptionStyle()]}
        onPress={() => setAnswer(option)}
      >
        {consequence !== null &&
          (consequence ? (
            <IconTrue width={20} height={20} />
          ) : (
            <IconFalse width={20} height={20} />
          ))}
        <Text style={[styles.optionText, { color: textColor }]}>{content}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titleText}>{contentDetail.contentObj.question}</Text>
      <View style={styles.quizLinkerContainer}>
        {options.map((option, index) => (
          <Option key={`linkOption-${option.id || index}`} option={option} />
        ))}
      </View>
      <View style={[styles.quizLinkerContainer, { marginTop: variables.scale(80) }]}>
        {linkOptions.map((option, index) => (
          <Option key={`option-${option.id || index}`} option={option} />
        ))}
      </View>
      {button === 'retry' ? (
        <View style={styles.resultContainer}>
          <View style={styles.resultTextContainer}>
            {answerFeedback.option.length === 0 ? (
              <IconTrueText width={17} height={17} />
            ) : (
              <IconFalseText width={17} height={17} />
            )}
            <Text
              style={[
                styles.resultText,
                answerFeedback.option.length === 0 ? { color: '#1ECC78' } : { color: '#FF0E39' },
              ]}
            >
              {answerFeedback.option.length === 0
                ? t('correct_answer')
                : t('your_answer_was_incorrect')}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.submitButton, styles.submitButtonActive]}
            onPress={() => {
              handleButton();
            }}
          >
            <Text style={[styles.submitButtonText, styles.submitButtonTextActive]}>
              {t('retry')}
            </Text>
          </TouchableOpacity>
          {answerFeedback.option.length > 0 && (
            <>
              <View style={styles.quizLinkerContainer}>
                {answerFeedback.option.map((option, index) => (
                  <Option key={`linkOption-${option.id || index}`} option={option} />
                ))}
              </View>
              <View style={[styles.quizLinkerContainer, { marginTop: variables.scale(80) }]}>
                {answerFeedback.linkOption.map((option, index) => (
                  <Option key={`option-${option.id || index}`} option={option} />
                ))}
              </View>
            </>
          )}
          <Text style={styles.feedbackTitleText}>{t('feedback')}</Text>
          <Text style={styles.feedbackText}>
            Object-oriented programming languages include Java, Python, C++, Ruby, C#, and many
            others.{' '}
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.submitButton, check.answer.length > 0 ? styles.submitButtonActive : {}]}
          onPress={() => {
            handleButton();
          }}
        >
          <Text
            style={[
              styles.submitButtonText,
              check.answer.length > 0 ? styles.submitButtonTextActive : {},
            ]}
          >
            {t('submit')}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    fontSize: variables.scale(32),
    fontWeight: '600',
    fontFamily: variables.fontFamily,
  },
  quizLinkerContainer: {
    flexDirection: 'column',
    marginTop: variables.scale(20),
  },
  optionDefault: {
    marginTop: variables.scale(40),
    borderWidth: 1,
    borderColor: '#D9D9D9',
    paddingHorizontal: variables.scale(32),
    paddingVertical: variables.scale(20),
    borderRadius: variables.scale(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    paddingLeft: variables.scale(20),
    fontSize: variables.scale(32),
    lineHeight: variables.scale(48),
    fontWeight: '400',
    fontFamily: variables.fontFamily,
  },
  submitButton: {
    marginTop: variables.scale(50),
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
});

export default QuizLinker;
