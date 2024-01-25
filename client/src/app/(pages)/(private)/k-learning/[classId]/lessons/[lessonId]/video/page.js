"use client";

import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";

import {
  ArrowForward,
  DescriptionOutlined,
  EditOutlined,
  PlayCircleOutlined,
} from "@mui/icons-material";
import { TextField } from "@mui/material";

import parser from "html-react-parser";

import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";

import CustomSpinningSkeleton from "@/app/components/CustomSpinningSkeleton";
import Custom404 from "@/app/components/Custom404";

function VideoLesson({ params }) {
  const user = useSelector((state) => state.user);
  const searchParams = useSearchParams();

  const [pageState, setPageState] = useState("loading");

  const [lessonData, setLessonData] = useState(null);

  useEffect(() => {
    if (Object.keys(user).length == 0) return;

    const api = `classes/${params.classId}/lessons/${params.lessonId}&user_id=${user._id}`;
    instance
      .get(api, getApiConfig())
      .then((res) => {
        const resLessonData = res.data;
        // if (resLessonData.ownerId !== user._id) {
        //   setPageState("not_found");
        //   return;
        // }

        setLessonData(resLessonData);
        setPageState("loaded");
      })
      .catch(() => {
        setPageState("not_found");
      });
  }, [user]);

  const getYouTubeVideoId = (url) => {
    const regExp =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    // Extract video ID using the regular expression
    const match = url.match(regExp);

    // Check if there is a match
    if (match && match[1]) {
      return match[1]; // Return the video ID
    } else {
      return null; // Return null if no match is found
    }
  };

  return (
    <Fragment>
      {pageState == "loading" ? (
        <CustomSpinningSkeleton />
      ) : pageState == "not_found" ? (
        <Custom404 />
      ) : (
        <div className="flex flex-col h-full">
          <div className="min-h-[calc(100%-50px)] p-4 bg-black">
            <iframe
              width="100%"
              height={"100%"}
              className=""
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                lessonData.mediaLink
              )}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
            />
          </div>

          <div className="mt-5 mb-5 border-t-2 border-slate-200">
            <div className="p-4">
              <div className="flex items-center text-lg font-semibold p-2 text-sky-600">
                <DescriptionOutlined className="mr-2" /> Mô tả
              </div>
              <div className="overflow-hidden ml-4 pl-4">
                {parser(lessonData.description)}
              </div>
            </div>
          </div>

          {/* question */}
          {/* <div className="mt-5 mb-5 border-t-2 border-slate-200">
            <div className="p-4">
              <div className="flex items-center text-lg font-semibold p-2 text-sky-600">
                <DescriptionOutlined className="mr-2" /> Hỏi đáp
              </div>
              <div className="pl-2">
            
                <div className="flex flex-col md:flex-row">
                  <div className="flex flex-col md:flex-row">
                    <img
                      src={user.profileImage}
                      className="h-8 w-8 object-cover rounded-full"
                    />
                    <TextField multiline maxRows={3} className="ml-2" />
                  </div>
                  <button>Binh luan</button>
                </div>
              </div>
            </div>
          </div> */}

          <div className="sticky bottom-0 left-0 bg-gray-800 flex justify-center">
            <div className="flex items-center p-3 pl-4">
              <PlayCircleOutlined className="animate-pulse text-orange-500" />
              <div className="ml-2 flex items-center">
                <span className="underline text-orange-500">
                  {searchParams.get("chapter_name")}:
                </span>
                <span className="ml-2 overflow-hidden text-orange-500">
                  {lessonData.name}
                </span>
              </div>
            </div>
            {user._id == lessonData.ownerId && (
              <div className="flex justify-start pl-2">
                <Link
                  href={{
                    pathname: `/k-learning/${params.classId}/lessons/${params.lessonId}/edit/video`,
                  }}
                  className="flex items-center"
                >
                  <div className="rounded-2xl bg-sky-500 flex items-center justify-center p-1 pl-3 pr-3 text-sm text-gray-200">
                    Chỉnh sửa
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default VideoLesson;
