"use client";

import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";

import React, { Fragment, useEffect, useState } from "react";

import Custom404 from "@/app/components/Custom404";
import CustomSkeleton from "@/app/components/CustomSkeleton";

import { ChevronLeftOutlined, ShareOutlined } from "@mui/icons-material";

import { usePathname, useSearchParams } from "next/navigation";
import { IconButton } from "@mui/material";
import LessonHeader from "@/app/components/KLearning/lessons/LessonHeader";
import Link from "next/link";
import CustomCircularProgress from "@/app/components/CustomCircularProgress";
import { useSelector } from "react-redux";
import CustomSnackBar from "@/app/components/CustomSnackBar";

export const handleGetClassData = (classId) => {
  const api = `classes/${classId}`;
  return instance.get(api, getApiConfig());
};

function ClassLayout({ children, params }) {
  const user = useSelector((state) => state.user);

  const splitPathname = usePathname().split("/");
  const currentPage = splitPathname[3];

  const [classData, setClassData] = useState("loading");

  useEffect(() => {
    if (Object.keys(user).length == 0) return;

    handleGetClassData(params.classId)
      .then((res) => {
        const classData = res.data;
        if (
          !(
            classData.ownerId == user._id ||
            classData.memberIds.includes(user._id)
          )
        ) {
          setClassData("not_found");
          return;
        }
        setClassData(classData);
      })
      .catch(() => {
        setClassData("not_found");
      });

    return () => {};
  }, [user]);

  const [snackBarData, setSnackBarData] = useState({
    content: "",
    open: false,
    severity: "",
  });

  return (
    <Fragment>
      {classData === "loading" ? (
        <CustomCircularProgress />
      ) : classData == "not_found" ? (
        <Custom404 />
      ) : (
        <div className="min-h-[calc(100vh-100px)] w-full flex flex-col">
          <header className="mb-2 w-full bg-slate-800 flex items-center justify-between p-2 pr-2 rounded-lg">
            <div className="flex items-center pl-2">
              <Link className="" href={"/k-learning"}>
                <IconButton title="Quay lại">
                  <ChevronLeftOutlined className="text-gray-100" />
                </IconButton>
              </Link>
              <span className="ml-2 text-lg font-semibold text-gray-100">
                {classData.classname}
              </span>
              <IconButton
                title="Chia sẻ ID lớp học"
                className="ml-2 bg-sky-500 hover:bg-sky-600"
                onClick={() => {
                  navigator.clipboard.writeText(params.classId);
                  setSnackBarData(() => ({
                    content: "Đã sao chép ID lóp học",
                    severity: "info",
                    open: true,
                  }));
                }}
              >
                <ShareOutlined className="text-gray-50 text-base" />
              </IconButton>
              <CustomSnackBar
                content={snackBarData.content}
                severity={snackBarData.severity}
                open={snackBarData.open}
                onCLose={() => {
                  setSnackBarData((prev) => ({ ...prev, open: false }));
                }}
              />
            </div>
            <LessonHeader
              classId={params.classId}
              currentPage={currentPage}
              userRole={classData.ownerId == user._id ? "admin" : "member"}
              userId={user._id}
            />
          </header>
          <div className="border-2 border-sky-200 rounded-l-md flex-1 flex flex-col class-layout">
            {children}
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default ClassLayout;
