"use client";

import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";

import React, { Fragment, useEffect, useState } from "react";

import Link from "next/link";

import Custom404 from "@/app/components/Custom404";
import CustomSkeleton from "@/app/components/CustomSkeleton";

import {
  BadgeOutlined,
  ChevronLeftOutlined,
  EmailOutlined,
  HomeWorkOutlined,
  ReceiptLongOutlined,
  SchoolOutlined,
} from "@mui/icons-material";

import { usePathname, useSearchParams } from "next/navigation";
import { IconButton } from "@mui/material";

const pages = [
  {
    label: "Kênh chung",
    icon: <EmailOutlined className="text-slate-500" />,
    path: "general",
  },
  {
    label: "Bài giảng",
    icon: <SchoolOutlined className="text-slate-500" />,
    path: "lessons",
  },

  {
    label: "Bài tập",
    icon: <HomeWorkOutlined className="text-slate-500" />,
    path: "homework",
  },
  {
    label: "Bài thi",
    icon: <ReceiptLongOutlined className="text-slate-500" />,
    path: "examination",
  },
  {
    label: "Danh sách thành viên",
    icon: <BadgeOutlined className="text-slate-500" />,
    path: "students",
  },
];

export const handleGetClassData = (classId) => {
  const api = `classes/${classId}`;
  return instance.get(api, getApiConfig());
};

function ClassLayout({ children }) {
  const searchParams = useSearchParams();

  const [pageState, setPageState] = useState("loaded");

  const [classData, setClassData] = useState(null);

  const splitPathname = usePathname().split("/");
  const pathname = splitPathname[3];

  // useEffect(() => {
  //   handleGetClassData(params.classId)
  //     .then((res) => {
  //       setClassData(res.data);
  //       setPageState("loaded");
  //     })
  //     .catch(() => {
  //       setPageState("not_found");
  //     });
  //   return () => {};
  // }, []);

  return (
    <Fragment>
      {pageState === "loading" ? (
        <CustomSkeleton />
      ) : pageState == "not_found" ? (
        <Custom404 />
      ) : (
        <div className="min-h-[calc(100vh-100px)] w-full border-sky-200 border-2 rounded-lg flex flex-col">
          <header className="w-full flex items-center justify-between p-3 pl-0 rounded-lg">
            <div className="flex items-center pl-2">
              <IconButton title="Quay lại">
                <ChevronLeftOutlined />
              </IconButton>
              <span className="ml-2 text-lg font-semibold text-sky-600">
                {searchParams.get("class_name")}
              </span>
            </div>
            <div className="flex items-center justify-end">
              {pages.map((page, index) => {
                return (
                  <Link
                    key={`class-menu-${index}`}
                    className={`flex items-center ml-3 p-2 duration-300 rounded-lg border-2 border-slate-200 hover:bg-sky-200 hover:border-sky-200 ${
                      pathname == page.path && "bg-sky-200"
                    }`}
                    href={{
                      pathname: `/k-learning/${searchParams.get("class_id")}/${
                        page.path
                      }`,
                      query: {
                        class_id: searchParams.get("class_id"),
                        class_name: searchParams.get("class_name"),
                      },
                    }}
                  >
                    <span>{page.icon}</span>
                    <span className="ml-1 text-slate-700 text-sm font-semibold">
                      {page.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </header>
          <div className="border-t-2 border-sky-200 mt-2 flex-1 flex flex-col class-layout">
            {children}
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default ClassLayout;
