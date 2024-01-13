"use client";

import { DescriptionOutlined } from "@mui/icons-material";
import { FormControlLabel, FormGroup, Switch, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function useExaminationLessonEditor({ lessonData }) {
  const user = useSelector((state) => state.user);

  const [examinationLessonData, setExaminationData] = useState({
    name: "",
    isScoreShowed: true,
    isQuestionShuffled: false,
  });

  useEffect(() => {
    if (!lessonData) return () => {};
    setExaminationData(lessonData);
  }, [lessonData]);

  return {
    examinationLessonData: examinationLessonData,
    examinationLessonEditorElement: (
      <div>
        <div>
          <header className="font-semibold text-sky-500">
            <DescriptionOutlined className="text-sky-500" />
            Thông tin bài thi
          </header>
          {/* <div className="grid grid-cols-1 md:grid-cols-2"> */}
          <FormGroup>
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <TextField placeholder="Nhập tên bài thi" />
              <FormControlLabel
                control={<Switch />}
                label="Cho phép xem đáp án"
              />
              <FormControlLabel control={<Switch />} label="Trộn câu hỏi" />
            </div>
          </FormGroup>
          {/* </div> */}
        </div>
      </div>
    ),
  };
}

export default useExaminationLessonEditor;
