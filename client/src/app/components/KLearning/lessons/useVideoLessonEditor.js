"use client";

import { useEffect, useRef, useState } from "react";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
  AbcOutlined,
  DescriptionOutlined,
  LinkOutlined,
} from "@mui/icons-material";

import { TextField } from "@mui/material";

function useVideoLessonEditor({ lessonData }) {
  const editorRef = useRef(null);

  const [createLessonFormData, setCreateLessonFormData] = useState({
    name: "",
    mediaLink: "",
    description: "",
  });

  useEffect(() => {
    if (!lessonData) return;
    setCreateLessonFormData({
      name: lessonData.name || "",
      mediaLink: lessonData.mediaLink || "",
      description: lessonData.description || "",
    });

    return () => {};
  }, [lessonData]);

  return {
    videoLessonData: createLessonFormData,
    videoLessonEditorElement: (
      <div className="">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="font-semibold mb-2">
              <AbcOutlined className="mr-2 text-sky-400" /> Nhập tên bài giảng
            </span>
            <TextField
              value={createLessonFormData.name}
              onChange={(e) => {
                setCreateLessonFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }}
              placeholder="Nhập tên bài giảng"
              error={!createLessonFormData.name.trim()}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold mb-2">
              <LinkOutlined className="mr-2 text-sky-400" /> Nhập liên kết video
            </span>
            <TextField
              placeholder="Nhập liên kết video"
              error={!createLessonFormData.mediaLink.trim()}
              value={createLessonFormData.mediaLink}
              onChange={(e) => {
                setCreateLessonFormData((prev) => ({
                  ...prev,
                  mediaLink: e.target.value,
                }));
              }}
            />
          </div>
        </div>
        <div className="mt-5">
          <div className="font-semibold mb-3">
            <DescriptionOutlined className="mr-2 text-sky-400" /> Nhập mô tả
            khóa học
          </div>
          <CKEditor
            editor={ClassicEditor}
            ref={editorRef}
            onChange={(event, editor) => {
              const data = editor.getData();
              setCreateLessonFormData((prev) => ({
                ...prev,
                description: data,
              }));
            }}
            data={createLessonFormData.description}
          />
        </div>
      </div>
    ),
  };
}

export default useVideoLessonEditor;
