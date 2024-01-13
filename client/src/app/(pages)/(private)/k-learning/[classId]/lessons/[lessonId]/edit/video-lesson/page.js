"use client";

import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Button } from "@mui/material";

import Custom404 from "@/app/components/Custom404";
import CustomSnackBar from "@/app/components/CustomSnackBar";
import CustomSpinningSkeleton from "@/app/components/CustomSpinningSkeleton";
import useVideoLessonEditor from "@/app/components/KLearning/lessons/useVideoLessonEditor";

import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";
import { RefreshOutlined } from "@mui/icons-material";

function LessonEditor({ params }) {
  const user = useSelector((state) => state.user);

  const [pageState, setPageState] = useState("loading");

  const [lessonData, setLessonData] = useState(null);

  const [isSubmitBtnSpinning, setIsSubmitBtnSpinning] = useState(false);

  const { videoLessonEditorElement, videoLessonData } = useVideoLessonEditor({
    lessonData,
  });

  // snack bar
  const [snackBarData, setSnackBarData] = useState({
    content: "",
    open: false,
    severity: "",
  });

  const handleSubmitLessonData = () => {
    setIsSubmitBtnSpinning(true);

    const api = `/classes/${params.classId}/lessons/${params.lessonId}/update`;
    instance
      .patch(api, videoLessonData, getApiConfig())
      .then(() => {
        setSnackBarData(() => ({
          content: "Cập nhật bài giảng thành công",
          severity: "success",
          open: true,
        }));
      })
      .catch(() => {
        setSnackBarData(() => ({
          content: "Cập nhật bài giảng thất bại",
          severity: "error",
          open: true,
        }));
      })
      .finally(() => {
        setIsSubmitBtnSpinning(false);
      });
  };

  useEffect(() => {
    if (Object.keys(user).length == 0) return;

    const api = `classes/${params.classId}/lessons/${params.lessonId}`;
    instance
      .get(api, getApiConfig())
      .then((res) => {
        const resLessonData = res.data;
        if (resLessonData.ownerId !== user._id) {
          setPageState("not_found");
          return;
        }

        setLessonData(res.data);
        setPageState("loaded");
      })
      .catch(() => {
        setPageState("not_found");
      });
  }, [user]);

  return (
    <Fragment>
      {pageState == "loading" ? (
        <CustomSpinningSkeleton />
      ) : pageState == "not_found" ? (
        <Custom404 />
      ) : (
        <div className="">
          <CustomSnackBar
            content={snackBarData.content}
            severity={snackBarData.severity}
            open={snackBarData.open}
            onCLose={() => {
              setSnackBarData((prev) => ({ ...prev, open: false }));
            }}
          />
          <header className="sticky top-0 left-0 z-10 border-b-2 border-slate-100 bg-white p-4 flex items-center justify-between">
            <div className="text-orange-600 font-semibold">
              Chỉnh sửa bài giảng: <span>{lessonData.name}</span>
            </div>
            <Button
              variant="outlined"
              style={{ minWidth: "115px" }}
              onClick={handleSubmitLessonData}
              disabled={
                !(
                  videoLessonData.name.trim() &&
                  videoLessonData.mediaLink.trim()
                )
              }
            >
              {isSubmitBtnSpinning ? (
                <RefreshOutlined className="text-sky-500 animate-spin" />
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </header>
          <div className="p-3">{videoLessonEditorElement}</div>
        </div>
      )}
    </Fragment>
  );
}

export default LessonEditor;
