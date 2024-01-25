"use client";

import Custom404 from "@/app/components/Custom404";
import LessonSidebar from "@/app/components/KLearning/lessons/LessonSidebar";
import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";
import { CircularProgress } from "@mui/material";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

function LessonLayout({ children, params }) {
  const user = useSelector((state) => state.user);

  const [classData, setClassData] = useState(null);

  const [pageState, setPageState] = useState("loading");

  const handleGetAllChapters = () => {
    const api = `classes/${params.classId}/all-chapters`;

    instance
      .get(api, getApiConfig())
      .then((res) => {
        setClassData(res.data);
        setPageState("loaded");
      })
      .catch(() => {
        setPageState("not_found");
      });
  };

  const [wrapperHeight, setWrapperHeight] = useState(0);

  const wrapperRef = useRef(null);

  useEffect(() => {
    if (Object.keys(user).length == 0) return;

    handleGetAllChapters();

    return () => {};
  }, [user]);

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;

    const wrapperHeight =
      document.body.offsetHeight -
      wrapperRef.current.getBoundingClientRect().top;

    setWrapperHeight(wrapperHeight - 15);

    return () => {};
  });

  return (
    <Fragment>
      {pageState == "loaded" ? (
        <div
          className="flex wrapper relative"
          ref={wrapperRef}
          style={{ height: wrapperHeight > 0 && `${wrapperHeight}px` }}
        >
          <div className="flex-1 flex flex-col overflow-y-scroll">
            {children}
          </div>
          <LessonSidebar
            // wrapperHeight={wrapperHeight}
            classData={classData}
            handleReloadChapters={handleGetAllChapters}
          />
        </div>
      ) : (
        <div className="h-full flex-1 w-full flex justify-center items-center">
          {pageState == "loading" ? (
            <CircularProgress color="success" />
          ) : (
            <Custom404 />
          )}
        </div>
      )}
    </Fragment>
  );
}

export default LessonLayout;
