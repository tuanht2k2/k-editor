"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { ChevronLeftOutlined } from "@mui/icons-material";
import { Button, CircularProgress, IconButton } from "@mui/material";

import CustomSnackBar from "@/app/components/CustomSnackBar";
import useExaminationLessonEditor from "@/app/components/KLearning/lessons/useExaminationLessonEditor";

import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";

function CreateExaminationLesson({ params }) {
  const user = useSelector((state) => state.user);

  const searchParams = useSearchParams();

  const { examinationLessonEditorElement, examinationLessonData } =
    useExaminationLessonEditor({
      lessonData: null,
    });

  const [isSubmitBtnSpinning, setIsSubmitBtnSpinning] = useState(false);

  const [snackBarData, setSnackBarData] = useState({
    content: "",
    open: false,
    severity: "",
  });

  // api
  const handleCreateLesson = () => {
    if (!searchParams.get("chapter_id")) {
      setSnackBarData(() => ({
        content: "Đã xảy ra lỗi",
        severity: "error",
        open: true,
      }));
      return;
    }

    setIsSubmitBtnSpinning(true);

    const api = `/classes/${params.classId}/examination-lesson-editor`;

    const examData = {
      lesson: {
        ...examinationLessonData.lesson,
        ownerId: user._id,
        classId: params.classId,
        chapterId: searchParams.get("chapter_id"),
        type: "examination",
      },
      questions: examinationLessonData.questions,
    };

    instance
      .post(api, examData, getApiConfig())
      .then(() => {
        setSnackBarData(() => ({
          content: "Tạo bài thi thành công",
          severity: "success",
          open: true,
        }));
      })
      .catch(() => {
        setSnackBarData(() => ({
          content: "Tạo bài thi thất bại",
          severity: "error",
          open: true,
        }));
      })
      .finally(() => {
        setIsSubmitBtnSpinning(false);
      });
  };

  return (
    <div className="flex-1">
      <CustomSnackBar
        content={snackBarData.content}
        severity={snackBarData.severity}
        open={snackBarData.open}
        onCLose={() => {
          setSnackBarData((prev) => ({ ...prev, open: false }));
        }}
      />

      <div className="sticky top-0 left-0 bg-gray-100 z-50 p-2 flex items-center justify-between border-b-2 border-b-slate-200">
        <div className="flex items-center">
          <Link href={`/k-learning/${params.classId}/lessons`}>
            <IconButton>
              <ChevronLeftOutlined className="text-slate-600" />
            </IconButton>
          </Link>
          <h1 className="ml-2 flex items-center font-semibold">
            <span className=" text-slate-600 font-semibold underline">
              {searchParams.get("chapter_name")}
            </span>
            : Tạo bài thi
          </h1>
        </div>
        <Button
          variant="outlined"
          style={{ minWidth: "115px" }}
          disabled={!examinationLessonData.lesson.name.trim()}
          onClick={handleCreateLesson}
        >
          {isSubmitBtnSpinning ? (
            <CircularProgress size={20} color="info" />
          ) : (
            "Tạo mới"
          )}
        </Button>
      </div>
      <div className="main mt-2 p-3">{examinationLessonEditorElement}</div>
    </div>
  );
}

export default CreateExaminationLesson;
