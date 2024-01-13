"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { ChevronLeftOutlined } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";

function CreateLesson({ params }) {
  const searchParams = useSearchParams();

  return (
    <div className="flex-1">
      <div className="sticky top-0 left-0 bg-slate-100 z-50 p-2 flex items-center justify-between border-b-2 border-b-slate-200">
        <div className="flex items-center">
          <Link href={`/k-learning/${params.lessonId}/lessons`}>
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
      </div>
      <div className="main mt-2 p-3">
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 max-w-3xl">
          <div className="p-2 flex flex-col lg:p-5">
            <img
              src="/assets/images/video_lesson_image.png"
              className="border-2 border-sky-300 flex-1 object-cover rounded-lg mb-2"
            />
            <Button variant="outlined">
              <Link
                href={{
                  pathname: `/k-learning/${params.classId}/lessons/create-lesson/video-lesson`,
                  query: {
                    chapter_name: searchParams.get("chapter_name"),
                    chapter_id: searchParams.get("chapter_id"),
                  },
                }}
              >
                Tạo bài giảng mới
              </Link>
            </Button>
          </div>
          <div className="p-2 flex flex-col lg:p-5">
            <img
              src="/assets/images/exam_lesson_image.jpg"
              className="border-2 border-sky-300 flex-1 object-cover rounded-lg mb-2"
            />
            <Button variant="outlined">
              <Link
                href={{
                  pathname: `/k-learning/${params.classId}/lessons/create-lesson/examination-lesson`,
                  query: {
                    chapter_name: searchParams.get("chapter_name"),
                    chapter_id: searchParams.get("chapter_id"),
                  },
                }}
              >
                Tạo bài kiểm tra mới
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateLesson;
