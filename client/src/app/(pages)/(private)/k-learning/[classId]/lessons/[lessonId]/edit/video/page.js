"use client";

import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { Button, CircularProgress } from "@mui/material";

import Custom404 from "@/app/components/Custom404";
import CustomSnackBar from "@/app/components/CustomSnackBar";
import CustomSpinningSkeleton from "@/app/components/CustomSpinningSkeleton";
import useVideoLessonEditor from "@/app/components/KLearning/lessons/useVideoLessonEditor";
import ConfirmBox from "@/app/components/ConfirmBox";

import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";

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

    const api = `classes/${params.classId}/lessons/${params.lessonId}&user_id=${user._id}`;
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

  // delete lesson

  const router = useRouter();

  const [isDeleteLessonBtnSpinning, setIsDeleteLessonBtnSpinning] =
    useState(false);

  const [isDeleteLessonConfirmBoxVisible, setIsDeleteLessonConfirmBoxVisible] =
    useState(false);

  const handleDeleteLesson = () => {
    setIsDeleteLessonConfirmBoxVisible(false);
    setIsDeleteLessonBtnSpinning(true);

    const api = `classes/${params.classId}/lessons/${params.lessonId}/delete`;
    instance
      .delete(api, getApiConfig())
      .then(() => {
        setSnackBarData(() => ({
          content: "Xóa thi thành công",
          severity: "success",
          open: true,
        }));
      })
      .then(() => {
        router.push(`/k-learning/${params.classId}/lessons`);
      })
      .catch(() => {
        setSnackBarData(() => ({
          content: "Đã xảy ra lỗi",
          severity: "error",
          open: true,
        }));
      })
      .finally(() => {
        setIsDeleteLessonBtnSpinning(false);
      });
  };

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
              {lessonData.name}
            </div>
            <div className="flex items-center">
              <Button
                variant="outlined"
                style={{ minWidth: "115px", marginRight: "10px" }}
                onClick={handleSubmitLessonData}
                disabled={
                  !(
                    videoLessonData.name.trim() &&
                    videoLessonData.mediaLink.trim()
                  )
                }
              >
                {isSubmitBtnSpinning ? (
                  <CircularProgress
                    size={20}
                    className="text-sky-500 animate-spin"
                  />
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
              <ConfirmBox
                visible={isDeleteLessonConfirmBoxVisible}
                onCancel={() => {
                  setIsDeleteLessonConfirmBoxVisible(false);
                }}
                onConfirm={handleDeleteLesson}
              >
                <Button
                  color="error"
                  onClick={() => {
                    setIsDeleteLessonConfirmBoxVisible(true);
                  }}
                >
                  {isDeleteLessonBtnSpinning ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Xóa bài học"
                  )}
                </Button>
              </ConfirmBox>
            </div>
          </header>
          <div className="p-3">{videoLessonEditorElement}</div>
        </div>
      )}
    </Fragment>
  );
}

export default LessonEditor;
