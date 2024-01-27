"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import {
  CheckCircleOutline,
  QuizOutlined,
  SportsScoreOutlined,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

import Custom404 from "@/app/components/Custom404";
import CustomCircularProgress from "@/app/components/CustomCircularProgress";
import CustomSnackBar from "@/app/components/CustomSnackBar";

import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";

function ExaminationLesson({ params }) {
  const [examStatus, setExamStatus] = useState("not_started"); // started, completed

  const user = useSelector((state) => state.user);

  const [examData, setExamData] = useState("loading");

  const [isSubmitBtnSpinning, setIsSubmitBtnSpinning] = useState(false);

  const handleSelectCorrectAnswer = (questionIndex, answerIndex) => {
    // reset correct answer
    const question = { ...examData.questions[questionIndex] };
    question.answers.filter((answer) => {
      if ((answer.correct = true)) {
        answer.correct = false;
        return;
      }
    });

    // set correct answer
    question.answers[answerIndex].correct = true;
    setExamData((prev) => {
      const currentQuestions = [...prev.questions];
      currentQuestions.splice(questionIndex, 1, question);
      return { ...prev, questions: currentQuestions };
    });
  };

  const getCorrectAnswer = (questionIndex) => {
    const question = { ...examData.questions[questionIndex] };

    const answerIndex = question.answers.findIndex((answer) => {
      return !!answer.correct;
    });

    return `${questionIndex}_${answerIndex}`;
  };

  const handleSubmitExam = () => {
    setIsSubmitBtnSpinning(true);

    const api = `examinations/submit&user_id=${user._id}`;

    instance
      .post(api, examData, getApiConfig())
      .then((res) => {
        setExamData(res.data);
        setExamStatus("completed");
        setSnackBarData(() => ({
          content: "Nộp bài thi thành công",
          severity: "success",
          open: true,
        }));
      })
      .catch(() => {
        setSnackBarData(() => ({
          content: "Nộp bài thi thất bại",
          severity: "error",
          open: true,
        }));
      })
      .finally(() => {
        setIsSubmitBtnSpinning(false);
      });
  };

  // snackbar
  const [snackBarData, setSnackBarData] = useState({
    content: "",
    open: false,
    severity: "",
  });

  useEffect(() => {
    if (Object.keys(user).length == 0) return () => {};

    const api = `classes/${params.classId}/lessons/${params.lessonId}&user_id=${user._id}`;

    instance
      .get(api, getApiConfig())
      .then((res) => {
        const resExamData = res.data;
        console.log(resExamData);
        if (resExamData.lesson.ownerId == user._id) {
          setExamStatus("admin_view");
        }
        if (resExamData.score !== null) {
          setExamStatus("completed");
        }
        setExamData(resExamData);
      })
      .catch(() => {
        setExamData("not_found");
      });

    return () => {};
  }, [user]);

  // time

  // let examTimeInterval = useRef(null);

  // const [timeLeft, setTimeLeft] = useState("");

  // const timer = () => {
  //   console.log(timeLeft);

  //   if (timeLeft > 0) {
  //     setTimeLeft((prev) => prev - 1);
  //   } else {
  //     console.log("cook");
  //     clearInterval(examTimeInterval.current);
  //   }
  // };

  // useEffect(() => {
  //   if (examStatus !== "started") return;

  //   if (timeLeft == 0) return;

  //   examTimeInterval = setInterval(timer, 1000);

  //   return () => {
  //     clearInterval(examTimeInterval.current);
  //   };
  // }, [examStatus]);

  return (
    <Fragment>
      {examData == "loading" ? (
        <CustomCircularProgress />
      ) : examData == "not_found" ? (
        <Custom404 />
      ) : (
        <div className="flex-1 flex flex-col">
          <CustomSnackBar
            content={snackBarData.content}
            severity={snackBarData.severity}
            open={snackBarData.open}
            onCLose={() => {
              setSnackBarData((prev) => ({ ...prev, open: false }));
            }}
          />
          <header className="sticky top-0 left-0 bg-gray-100 z-10 p-3 flex items-center justify-between font-semibold">
            <div className="flex items-center text-orange-500">
              <QuizOutlined className="mr-2 text-orange-500" />
              {examData.lesson.name}
            </div>
            {user._id == examData.lesson.ownerId ? (
              <Link
                href={`/k-learning/${examData.lesson.classId}/lessons/${examData.lesson._id}/edit/examination`}
              >
                <Button
                  className="bg-white hover:bg-red-50"
                  variant="outlined"
                  color="error"
                >
                  Chỉnh sửa
                </Button>
              </Link>
            ) : (
              <div className="flex items-center">
                {examData.score == null ? (
                  <div className="flex items-center">
                    {/* <span className="mr-4">18:20</span> */}
                    <Button
                      className="bg-white hover:bg-red-50"
                      variant="outlined"
                      color="error"
                      onClick={handleSubmitExam}
                      disabled={examStatus !== "started"}
                      style={{ minWidth: "115px" }}
                    >
                      {isSubmitBtnSpinning ? (
                        <CircularProgress size={20} />
                      ) : (
                        "Nộp bài"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="shadow-sm shadow-red-800 rounded-full p-2 flex items-center justify-center bg-red-500 text-gray-100">
                    {examData.score}
                  </div>
                )}
              </div>
            )}
          </header>
          <div className="flex-1 p-3 h-full">
            {examStatus == "started" || examStatus == "view" ? (
              <ul className="rounded-lg pl-3">
                {examData.questions.map((question, questionIndex) => {
                  const answers = question.answers;
                  return (
                    <li
                      key={`question_${question._id}`}
                      className="mt-4 border-2 border-sky-100 rounded-2xl bg-gray-50 p-5 flex flex-col"
                    >
                      <span className="border-b-2 border-slate-200">{`${
                        questionIndex + 1
                      }. ${question.content}`}</span>
                      <FormControl className="p-3">
                        <RadioGroup
                          defaultValue={
                            // examData.score !== null &&
                            // getCorrectAnswer(questionIndex)
                            ""
                          }
                          onChange={(e) => {
                            const splitValue = e.target.value.split("_");
                            handleSelectCorrectAnswer(
                              parseInt(splitValue[0]),
                              parseInt(splitValue[1])
                            );
                          }}
                        >
                          {answers.map((answer, answerIndex) => {
                            return (
                              <FormControlLabel
                                key={`answer_${answer._id}`}
                                label={answer.content}
                                control={
                                  <Radio
                                    value={`${questionIndex}_${answerIndex}`}
                                    disabled={
                                      user._id == examData.lesson.ownerId ||
                                      examData.score !== null
                                    }
                                  />
                                }
                              />
                            );
                          })}
                        </RadioGroup>
                      </FormControl>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="h-full flex items-center justify-center flex-col">
                <div className="flex flex-col items-center font-medium">
                  <span>{`Bài thi có ${examData.questions.length} câu hỏi`}</span>
                  <span>{`Hệ số điểm: ${examData.lesson.coefficient}`}</span>
                  <span>
                    {examData.lesson.timeInMinutes
                      ? `Thời gian làm bài: ${examData.lesson.timeInMinutes} phút`
                      : "Bài thi không giới hạn thời gian"}
                  </span>
                </div>
                {examData.score !== null && (
                  <div className="flex items-center text-lg text-green-700">
                    Bạn đã hoàn thành bài thi
                    <CheckCircleOutline className="ml-2" />
                  </div>
                )}
                <button
                  className="mt-2 rounded-lg border-b-0 border-red-400 shadow-md shadow-red-700 bg-red-500 p-3 text-gray-100 font-medium hover:bg-red-600 duration-300 cursor-pointer"
                  onClick={() => {
                    if (
                      examData.lesson.ownerId == user._id ||
                      examData.score !== null
                    ) {
                      setExamStatus("view");
                    } else {
                      setExamStatus("started");
                      // setTimeLeft(examData.lesson.timeInMinutes);
                    }
                  }}
                >
                  {examStatus == "not_started"
                    ? "Bắt đầu làm bài"
                    : examStatus == "completed"
                    ? "Xem lại câu hỏi"
                    : "Xem câu hỏi"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default ExaminationLesson;
