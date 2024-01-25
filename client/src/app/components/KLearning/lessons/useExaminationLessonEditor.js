"use client";

import {
  AddCircleOutline,
  AddOutlined,
  ClearOutlined,
  DeleteOutline,
  DescriptionOutlined,
  QuizOutlined,
} from "@mui/icons-material";
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

function useExaminationLessonEditor({ lessonData }) {
  const [examinationLessonData, setExaminationData] = useState({
    lesson: {
      name: "",
      scoreShowed: true,
      coefficient: 0,
      timeInMinutes: 0,
    },
    questions: [],
    deletedQuestions: [],
    deletedAnswers: [],
  });

  const handleAddQuestion = () => {
    setExaminationData((prev) => ({
      ...prev,
      questions: [
        ...prev["questions"],
        { content: "Câu hỏi không có tiêu đề", answers: [] },
      ],
    }));
  };

  const handleChangeQuestionContent = (questionIndex, value) => {
    setExaminationData((prev) => {
      prev.questions[questionIndex] = {
        ...prev.questions[questionIndex],
        content: value,
      };
      return { ...prev };
    });
  };

  const handleDeleteQuestion = (questionIndex) => {
    setExaminationData((prev) => {
      const currentQuestions = [...prev.questions];
      const question = currentQuestions[questionIndex];
      currentQuestions.splice(questionIndex, 1);

      return {
        ...prev,
        questions: currentQuestions,
        deletedQuestions: question._id
          ? [...prev["deletedQuestions"], question._id]
          : prev["deletedQuestions"],
      };
    });
  };

  const handleAddAnswer = (questionIndex) => {
    setExaminationData((prev) => {
      const currentQuestions = [...prev.questions];
      const currentQuestion = currentQuestions[questionIndex];
      const updatedQuestion = {
        ...currentQuestion,
        answers: [
          ...currentQuestion["answers"],
          { content: "Câu trả lời không có tiêu đề", correct: false },
        ],
      };
      currentQuestions.splice(questionIndex, 1, updatedQuestion);

      return { ...prev, questions: currentQuestions };
    });
  };

  const handleSelectCorrectAnswer = (questionIndex, answerIndex) => {
    // reset correct answer
    const question = { ...examinationLessonData.questions[questionIndex] };
    question.answers.filter((answer) => {
      if ((answer.correct = true)) {
        answer.correct = false;
        return;
      }
    });

    // set correct answer
    question.answers[answerIndex].correct = true;
    setExaminationData((prev) => {
      const currentQuestions = [...prev.questions];
      currentQuestions.splice(questionIndex, 1, question);
      return { ...prev, questions: currentQuestions };
    });
  };

  const getCorrectAnswer = (questionIndex) => {
    const question = { ...examinationLessonData.questions[questionIndex] };

    const answerIndex = question.answers.findIndex((answer) => {
      return !!answer.correct;
    });

    return `${questionIndex}_${answerIndex}`;
  };

  const handleDeleteAnswer = (questionIndex, answerIndex) => {
    const question = { ...examinationLessonData.questions[questionIndex] };
    const answer = question.answers[answerIndex];
    question.answers.splice(answerIndex, 1);

    setExaminationData((prev) => {
      const questions = [...prev.questions];
      questions.splice(questionIndex, 1, question);
      return {
        ...prev,
        questions: questions,
        deletedAnswers: answer._id
          ? [...prev["deletedAnswers"], answer._id]
          : prev["deletedAnswers"],
      };
    });
  };

  const handleChangeAnswerValue = (questionIndex, answerIndex, value) => {
    const question = { ...examinationLessonData.questions[questionIndex] };
    question.answers[answerIndex].content = value;

    setExaminationData((prev) => {
      const currentQuestions = [...prev.questions];
      currentQuestions.splice(questionIndex, 1, question);
      return { ...prev, questions: currentQuestions };
    });
  };

  useEffect(() => {
    if (typeof lessonData == "string" || !lessonData) return () => {};
    setExaminationData(lessonData);
  }, [lessonData]);

  return {
    examinationLessonData: examinationLessonData,
    examinationLessonEditorElement: (
      <div className="">
        <div className="border-2 border-sky-10 rounded-lg bg-gray-50 p-3">
          <header className="pb-2 flex items-center font-semibold text-sky-500 border-b-2 border-slate-200">
            <DescriptionOutlined className="mr-2 text-sky-500" />
            Thông tin bài thi
          </header>
          <FormGroup className="mt-3 bg-white rounded-lg p-2 pl-5">
            <div className="grid grid-cols-1">
              <TextField
                variant="standard"
                multiline
                placeholder="Nhập tên bài thi"
                className="mb-2"
                value={examinationLessonData.lesson.name}
                error={!examinationLessonData.lesson.name.trim()}
                onChange={(e) => {
                  setExaminationData((prev) => ({
                    ...prev,
                    lesson: { ...prev["lesson"], name: e.target.value },
                  }));
                }}
              />
              {/* <FormControlLabel
                className="flex mt-2"
                control={
                  <Switch
                    checked={examinationLessonData.lesson.scoreShowed}
                    onChange={(e) => {
                      setExaminationData((prev) => ({
                        ...prev,
                        lesson: {
                          ...prev["lesson"],
                          scoreShowed: e.target.checked,
                        },
                      }));
                    }}
                  />
                }
                label={<span className="">Cho phép xem đáp án</span>}
              /> */}

              <div
                className="flex mt-2 items-center"
                title="Hệ số 0 sẽ không tính điểm"
              >
                <span className="">Hệ số điểm bài thi</span>
                <div className="ml-2 flex items-center">
                  <FormControl>
                    <Select
                      labelId="demo-simple-select-label"
                      size="small"
                      id="demo-simple-select"
                      value={examinationLessonData.lesson.coefficient}
                      onChange={(e) => {
                        setExaminationData((prev) => ({
                          ...prev,
                          lesson: {
                            ...prev["lesson"],
                            coefficient: e.target.value,
                          },
                        }));
                      }}
                    >
                      <MenuItem value={0}>0</MenuItem>
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div
                className="flex mt-2 items-center"
                title="Mặc định sẽ không giới hạn thời gian"
              >
                <span className="">Thời gian làm bài</span>
                <div className="ml-2 flex items-center">
                  <FormControl>
                    <Select
                      labelId="demo-simple-select-label"
                      size="small"
                      id="demo-simple-select"
                      value={examinationLessonData.lesson.timeInMinutes}
                      onChange={(e) => {
                        setExaminationData((prev) => ({
                          ...prev,
                          lesson: {
                            ...prev["lesson"],
                            timeInMinutes: e.target.value,
                          },
                        }));
                      }}
                    >
                      <MenuItem value={0}>0</MenuItem>
                      <MenuItem value={15}>15 phút</MenuItem>
                      <MenuItem value={30}>30 phút</MenuItem>
                      <MenuItem value={45}>45 phút</MenuItem>
                      <MenuItem value={60}>60 phút</MenuItem>
                      <MenuItem value={90}>90 phút</MenuItem>
                      <MenuItem value={120}>120 phút</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
          </FormGroup>
        </div>
        <div className="mt-3 border-2 border-sky-100 rounded-lg bg-gray-50 p-3">
          <header className="flex items-center border-b-2 border-slate-200">
            <div className="mr-2 flex items-center font-semibold text-sky-500">
              <QuizOutlined className="mr-2 text-sky-500" />
              Câu hỏi
            </div>
            <IconButton title="Thêm câu hỏi" onClick={handleAddQuestion}>
              <AddCircleOutline className="text-sky-500" />
            </IconButton>
          </header>
          <ul>
            {examinationLessonData.questions.map((question, index) => {
              return (
                <li
                  key={`question_${index}`}
                  className="mt-2 bg-white rounded-lg p-4"
                >
                  <div className="flex justify-between items-center">
                    <TextField
                      variant="filled"
                      fullWidth
                      placeholder="Nhập câu hỏi"
                      maxRows={2}
                      multiline
                      error={!question.content.trim()}
                      value={question.content}
                      onChange={(e) => {
                        handleChangeQuestionContent(index, e.target.value);
                      }}
                    />
                    <IconButton
                      title="Xóa câu hỏi"
                      style={{ marginLeft: "4px" }}
                      onClick={() => {
                        handleDeleteQuestion(index);
                      }}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center">
                      <span className="font-semibold">Phương án trả lời</span>
                      <IconButton
                        title="Thêm câu trả lời"
                        style={{ marginLeft: "4px" }}
                        onClick={() => {
                          handleAddAnswer(index);
                        }}
                      >
                        <AddCircleOutline />
                      </IconButton>
                    </div>
                    {question.answers.length > 0 && (
                      <FormControl className="w-full">
                        <RadioGroup
                          className=""
                          defaultValue={getCorrectAnswer(index) || ""}
                          onChange={(e) => {
                            const splitValue = e.target.value.split("_");
                            handleSelectCorrectAnswer(
                              parseInt(splitValue[0]),
                              parseInt(splitValue[1])
                            );
                          }}
                        >
                          {question.answers.map((answer, answerIndex) => {
                            return (
                              <div
                                className="mt-2 flex items-center"
                                key={`answer_${answerIndex}`}
                              >
                                <FormControlLabel
                                  value={`${index}_${answerIndex}`}
                                  control={<Radio />}
                                />
                                <TextField
                                  className="flex-1"
                                  error={!answer.content}
                                  placeholder="Nhập nội dung câu trả lời"
                                  variant="standard"
                                  fullWidth
                                  multiline
                                  maxRows={2}
                                  value={answer.content}
                                  onChange={(e) => {
                                    handleChangeAnswerValue(
                                      index,
                                      answerIndex,
                                      e.target.value
                                    );
                                  }}
                                />
                                <IconButton
                                  style={{ marginLeft: "4px" }}
                                  title="Xóa câu trả lời"
                                  onClick={() => {
                                    handleDeleteAnswer(index, answerIndex);
                                  }}
                                >
                                  <ClearOutlined className="text-slate-400 text-lg" />
                                </IconButton>
                              </div>
                            );
                          })}
                        </RadioGroup>
                      </FormControl>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="sticky left-0 bottom-0 p-2">
            <IconButton
              title="Thêm câu hỏi"
              className="bg-orange-600 shadow-sm shadow-orange-500 hover:bg-orange-500"
              onClick={handleAddQuestion}
            >
              <AddOutlined className="text-gray-100" />
            </IconButton>
          </div>
        </div>
      </div>
    ),
  };
}

export default useExaminationLessonEditor;
