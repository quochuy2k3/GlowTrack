import { useState, useEffect, useCallback } from "react";
// import LMS_API from '../../../api/chapterQuiz/api';

const useFetchQuizLinker = (
  contentDetail: any,
  courseId: any,
  onLoadData: any,
  setIsCanNextQuestion: any
) => {
  const dataColor = [
    { chose: "#E8FAF1", true: "#1ECC78" },
    { chose: "#FFF2EC", true: "#FF7940" },
    { chose: "#E8F1FF", true: "#1975FF" },
    { chose: "#FDEAF9", true: "#EF2DA5" },
    { chose: "#F8F3FF", true: "#BC88FF" },
    { chose: "#FFFAF3", true: "#FFC888" },
  ];
  const [linkOptions, setLinkOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [button, setButton] = useState("");
  let tempAvailableColors = [...dataColor];
  const [answerFeedback, setAnswerFeedback] = useState({
    option: [],
    linkOption: [],
  });
  const randomColor = () => {
    if (tempAvailableColors.length === 0) {
      console.warn("Không còn màu khả dụng để chọn!");
      return null;
    }

    const randomIndex = Math.floor(Math.random() * tempAvailableColors.length);
    const picked = tempAvailableColors[randomIndex];

    tempAvailableColors = tempAvailableColors.filter(
      (color) => color.chose !== picked.chose
    );

    return picked;
  };

  const handleGetQuizLinkerDetail = (contentDetail, courseId, onLoadData) => {
    try {
      setLoading(true);
      if (contentDetail) {
        const addAttributes = (options, type) =>
          options.map((option) => ({
            ...option,
            type,
            chose: null,
            trueColor: null,
            choseColor: null,
            linkId: "",
            consequence: null,
          }));

        const updatedLinkOptions = addAttributes(
          contentDetail.contentObj.content.linkOptions,
          "linkOptions"
        );
        const updatedOptions = addAttributes(
          contentDetail.contentObj.content.options,
          "options"
        );

        setLinkOptions(updatedLinkOptions);
        setOptions(updatedOptions);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setButton(contentDetail.userAnswers ? "retry" : "submit");
      setLoading(false);
      setIsCanNextQuestion(contentDetail.userAnswers ? true : false);
    }
  };

  const findOptionById = (id, type) => {
    const optionsList = type === "linkOptions" ? linkOptions : options;
    const option = optionsList.find((option) => option.id === id);
    return option;
  };
  const checkConsequenceById = (linkOptionId, optionId) => {
    for (let i = 0; i < contentDetail.userAnswers.answers.answer.length; i++) {
      if (
        contentDetail.userAnswers.answers.answer[i] === optionId &&
        contentDetail.userAnswers.answers.linkAnswer[i] === linkOptionId
      ) {
        return true;
      }
    }
    return false;
  };

  const setAnswer = (answer) => {
    if (button === "retry") {
      return;
    }
    if (currentAnswer === null) {
      if (answer.linkId === "") {
        const color = randomColor();
        if (!color) {
          console.error("No colors available for assignment.");
          return;
        }
        answer.trueColor = color.true;
        answer.choseColor = color.chose;
        answer.chose = true;
        updateOptionById(answer.id, answer.type, answer);
        setCurrentAnswer(answer);
      } else if (answer.linkId !== "") {
        const anotherType =
          answer.type === "linkOptions" ? "options" : "linkOptions";
        const optionLinkChanged = findOptionById(answer.linkId, anotherType);
        if (optionLinkChanged) {
          optionLinkChanged.trueColor = null;
          optionLinkChanged.choseColor = null;
          optionLinkChanged.chose = false;
          optionLinkChanged.linkId = "";
          answer.linkId = "";
          answer.chose = true;
          updateOptionById(answer.id, answer.type, answer);
          updateOptionById(
            optionLinkChanged.id,
            anotherType,
            optionLinkChanged
          );
          setCurrentAnswer(answer);
        }
      }
    }
    if (currentAnswer !== null) {
      if (answer.type === currentAnswer.type) {
        if (answer.linkId === "") {
          if (answer.id === currentAnswer.id) {
            return;
          } else {
            currentAnswer.chose = false;
            answer.trueColor = currentAnswer.trueColor;
            answer.choseColor = currentAnswer.choseColor;
            answer.chose = true;
            updateOptionById(answer.id, answer.type, answer);
            updateOptionById(
              currentAnswer.id,
              currentAnswer.type,
              currentAnswer
            );
            setCurrentAnswer(answer);
          }
        }
        if (answer.linkId !== "") {
          const anotherType =
            answer.type === "linkOptions" ? "options" : "linkOptions";
          const optionChanged = findOptionById(answer.linkId, anotherType);
          removePickedColor(optionChanged.trueColor);
          if (optionChanged) {
            optionChanged.chose = false;
            optionChanged.trueColor = null;
            optionChanged.choseColor = null;
            optionChanged.linkId = "";
            updateOptionById(optionChanged.id, anotherType, optionChanged);
            answer.chose = true;
            answer.trueColor = currentAnswer.trueColor;
            answer.choseColor = currentAnswer.choseColor;
            currentAnswer.chose = false;
            currentAnswer.trueColor = null;
            currentAnswer.choseColor = null;
            answer.linkId = "";
            updateOptionById(answer.id, answer.type, answer);
            updateOptionById(
              currentAnswer.id,
              currentAnswer.type,
              currentAnswer
            );
            setCurrentAnswer(answer);
          }
        }
      }
      if (answer.type !== currentAnswer.type) {
        if (answer.linkId === "") {
          answer.trueColor = currentAnswer.trueColor;
          answer.choseColor = currentAnswer.choseColor;
          answer.chose = true;
          answer.linkId = currentAnswer.id;
          currentAnswer.linkId = answer.id;
          updateOptionById(answer.id, answer.type, answer);
          updateOptionById(currentAnswer.id, currentAnswer.type, currentAnswer);
          setCurrentAnswer(null);
        } else {
          const anotherType =
            answer.type === "linkOptions" ? "options" : "linkOptions";
          const optionChanged = findOptionById(answer.linkId, anotherType);
          removePickedColor(optionChanged.trueColor);
          if (optionChanged) {
            optionChanged.trueColor = null;
            optionChanged.choseColor = null;
            optionChanged.chose = false;
            optionChanged.linkId = "";
            updateOptionById(
              optionChanged.id,
              optionChanged.type,
              optionChanged
            );
            answer.trueColor = currentAnswer.trueColor;
            answer.choseColor = currentAnswer.choseColor;

            answer.linkId = currentAnswer.id;
            answer.chose = true;
            currentAnswer.linkId = answer.id;
            updateOptionById(answer.id, answer.type, answer);
            updateOptionById(
              currentAnswer.id,
              currentAnswer.type,
              currentAnswer
            );
            setCurrentAnswer(null);
          }
        }
      }
    }
  };

  const removePickedColor = (trueColor) => {
    tempAvailableColors = tempAvailableColors.filter(
      (color) => color.true !== trueColor
    );
  };

  const updateOptionById = (id, type, updatedOption) => {
    const optionsList = type === "linkOptions" ? linkOptions : options;
    const updatedList = optionsList.map((option) => {
      if (option.id === id) {
        if (updatedOption.chose && !updatedOption.color) {
        }
        return updatedOption;
      }
      return option;
    });
    type === "linkOptions"
      ? setLinkOptions(updatedList)
      : setOptions(updatedList);
  };

  useEffect(() => {
    handleGetQuizLinkerDetail(contentDetail, courseId, onLoadData);
  }, []);
  useEffect(() => {
    if (button === "retry") {
      setConsequenceAndColorForList();
    }
  }, [button]);
  const setConsequenceAndColorForList = () => {
    for (
      let i = 0;
      i < contentDetail.userAnswers?.correctAnswers?.answer?.length;
      i++
    ) {
      const newLinkOption = findOptionById(
        contentDetail.userAnswers.correctAnswers.linkAnswer[i],
        "linkOptions"
      );
      const newOption = findOptionById(
        contentDetail.userAnswers.correctAnswers.answer[i],
        "options"
      );
      if (newOption && newLinkOption) {
        const consequence = checkConsequenceById(
          newLinkOption.id,
          newOption.id
        );
        if (newOption.trueColor == null && newLinkOption.trueColor == null) {
          const newColor = randomColor();
          newOption.trueColor = newColor.true;
          newOption.choseColor = newColor.chose;
          newLinkOption.trueColor = newColor.true;
          newLinkOption.choseColor = newColor.chose;
        }
        newLinkOption.consequence = consequence;
        newOption.consequence = consequence;
        newLinkOption.linkId = newOption?.id;
        newOption.linkId = newLinkOption?.id;
        if (!consequence) {
          const tmpO = { ...newOption };
          const tmpLO = { ...newLinkOption };
          const color = randomColor();
          tmpLO.trueColor = color.true;
          tmpLO.choseColor = color.chose;
          tmpO.trueColor = color.true;
          tmpO.choseColor = color.chose;
          tmpO.chose = true;
          tmpO.consequence = null;
          tmpLO.chose = true;
          tmpLO.consequence = null;
          answerFeedback.option.push(tmpO);
          answerFeedback.linkOption.push(tmpLO);
        }
        updateOptionById(newOption?.id, "options", newOption);
        updateOptionById(newLinkOption?.id, "linkOptions", newLinkOption);
      }
    }
  };

  const submitQuiz = useCallback(async () => {
    const chosenOptions = linkOptions.filter(
      (option) => option.chose && option.linkId
    );

    const answers = {
      answer: chosenOptions.map((option) => option.linkId),
      linkAnswer: chosenOptions.map((option) => option.id),
    };

    try {
      // const response = await LMS_API.submitQuestion(
      //   courseId,
      //   contentDetail?.content,
      //   answers,
      //   contentDetail?.contentTypeExplanation,
      // );
      const response = {};

      if (response) {
        onLoadData && onLoadData();
        contentDetail.userAnswers = response.userAnswers;
        setButton("retry");
        setIsCanNextQuestion(true);
      }
    } catch (error) {
      console.error("Submit Error:", error);
    }
  }, [linkOptions, courseId, contentDetail, handleGetQuizLinkerDetail]);

  const handleButton = () => {
    if (button === "retry") {
      const resetContentDetail = {
        ...contentDetail,
        userAnswers: null,
      };
      answerFeedback.option = [];
      answerFeedback.linkOption = [];
      tempAvailableColors = [...dataColor];
      setCurrentAnswer(null);
      handleGetQuizLinkerDetail(resetContentDetail, courseId, onLoadData);
    }

    if (button === "submit") {
      submitQuiz();
    }
  };

  return {
    linkOptions,
    options,
    setAnswer,
    updateOptionById,
    loading,
    submitQuiz,
    button,
    handleButton,
    answerFeedback,
  };
};
export default useFetchQuizLinker;
