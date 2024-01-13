"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { ChevronLeftOutlined, RefreshOutlined } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import useVideoLessonEditor from "@/app/components/KLearning/lessons/useVideoLessonEditor";
import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";
import CustomSnackBar from "@/app/components/CustomSnackBar";
import { useSelector } from "react-redux";

function CreateVideoLesson({ params }) {
  const user = useSelector((state) => state.user);

  const searchParams = useSearchParams();

  const { videoLessonEditorElement, videoLessonData } = useVideoLessonEditor({
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
    setIsSubmitBtnSpinning(true);

    const api = `/classes/${params.classId}/create-lesson&type=video`;

    const lesson = {
      ownerId: user._id,
      classId: params.classId,
      chapterId: searchParams.get("chapter_id"),
      name: videoLessonData.name,
      description: videoLessonData.description,
      type: "video",
      mediaLink: videoLessonData.mediaLink,
    };

    instance
      .post(api, lesson, getApiConfig())
      .then(() => {
        setSnackBarData(() => ({
          content: "Tạo bài giảng thành công",
          severity: "success",
          open: true,
        }));
      })
      .catch(() => {
        setSnackBarData(() => ({
          content: "Tạo bài giảng thất bại",
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

      <div className="sticky top-0 left-0 bg-slate-100 z-50 p-2 flex items-center justify-between border-b-2 border-b-slate-200">
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
            : Tạo bài học
          </h1>
        </div>
        <Button
          variant="outlined"
          style={{ minWidth: "115px" }}
          disabled={
            !(videoLessonData.name.trim() && videoLessonData.mediaLink.trim())
          }
          onClick={handleCreateLesson}
        >
          {isSubmitBtnSpinning ? (
            <RefreshOutlined className="animate-spin" />
          ) : (
            "Tạo mới"
          )}
        </Button>
      </div>
      <div className="main mt-2 p-3">{videoLessonEditorElement}</div>
    </div>
  );
}

export default CreateVideoLesson;
