"use client";

import ConfirmBox from "@/app/components/ConfirmBox";
import Custom404 from "@/app/components/Custom404";
import CustomCircularProgress from "@/app/components/CustomCircularProgress";
import CustomSnackBar from "@/app/components/CustomSnackBar";
import useExaminationLessonEditor from "@/app/components/KLearning/lessons/useExaminationLessonEditor";
import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";
import { Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";

function ExaminationEditor({ params }) {
  const user = useSelector((state) => state.user);

  const [examData, setExamData] = useState("loading");

  const [isSubmitBtnSpinning, setIsSubmitBtnSpinning] = useState(false);

  const [snackBarData, setSnackBarData] = useState({
    content: "",
    open: false,
    severity: "",
  });

  const { examinationLessonData, examinationLessonEditorElement } =
    useExaminationLessonEditor({ lessonData: examData });

  const handleUpdateLesson = () => {
    setIsSubmitBtnSpinning(true);

    const api = `/classes/${params.classId}/examination-lesson-editor`;

    instance
      .post(api, examinationLessonData, getApiConfig())
      .then(() => {
        setSnackBarData(() => ({
          content: "Sửa bài thi thành công",
          severity: "success",
          open: true,
        }));
      })
      .catch(() => {
        setSnackBarData(() => ({
          content: "Sửa bài thi thất bại",
          severity: "error",
          open: true,
        }));
      })
      .finally(() => {
        setIsSubmitBtnSpinning(false);
      });
  };

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

  useEffect(() => {
    if (Object.keys(user).length == 0) return;

    const api = `classes/${params.classId}/lessons/${params.lessonId}&user_id=${user._id}`;
    instance
      .get(api, getApiConfig())
      .then((res) => {
        const resLessonData = res.data;
        if (resLessonData.lesson.ownerId !== user._id) {
          setExamData("not_found");
          return;
        }
        setExamData(res.data);
      })
      .catch(() => {
        setExamData("not_found");
      });
  }, [user]);

  return (
    <Fragment>
      {examData == "loading" ? (
        <CustomCircularProgress />
      ) : examData == "not_found" ? (
        <Custom404 />
      ) : (
        <div>
          <CustomSnackBar
            content={snackBarData.content}
            severity={snackBarData.severity}
            open={snackBarData.open}
            onCLose={() => {
              setSnackBarData((prev) => ({ ...prev, open: false }));
            }}
          />
          <header className="sticky top-0 left-0 bg-slate-50 z-10 border-b-2 border-b-slate-100 p-3 flex justify-between items-center">
            <div className="flex items-center text-orange-500 font-semibold">
              {examData.lesson.name}
            </div>
            <div className="flex items-center">
              <Button
                variant="outlined"
                onClick={handleUpdateLesson}
                style={{ minWidth: "115px" }}
              >
                {isSubmitBtnSpinning ? <CircularProgress size={20} /> : "Lưu"}
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
                  className="ml-2"
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
          <div className="p-3">{examinationLessonEditorElement}</div>
        </div>
      )}
    </Fragment>
  );
}

export default ExaminationEditor;
