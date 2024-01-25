"use client";

import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Link from "next/link";

import { PieChart } from "@mui/x-charts";
import { Button, CircularProgress, IconButton } from "@mui/material";
import {
  ChevronLeft,
  ExitToAppOutlined,
  ReportProblemOutlined,
} from "@mui/icons-material";

import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";

import CustomCircularProgress from "@/app/components/CustomCircularProgress";
import Custom404 from "@/app/components/Custom404";
import ConfirmBox from "@/app/components/ConfirmBox";
import CustomSnackBar from "@/app/components/CustomSnackBar";
import { useRouter } from "next/navigation";

function MemberInfo({ params }) {
  const user = useSelector((state) => state.user);

  const [overviewData, setOverviewData] = useState("loading");

  const handleGetMemberOverview = () => {
    const api = `classes/${params.classId}/overview/member_id=${params.memberId}`;
    instance
      .get(api, getApiConfig())
      .then((res) => {
        setOverviewData(res.data);
        console.log(res.data);
      })
      .catch(() => {
        setOverviewData("not_found");
      });
  };

  useEffect(() => {
    if (Object.keys(user).length == 0) return () => {};

    handleGetMemberOverview();

    return () => {};
  }, []);

  const [isConfirmBoxVisible, setIsConfirmBoxVisible] = useState(false);
  const [isLeaveClassBtnSpinning, setIsLeaveClassBtnSpinning] = useState(false);

  const router = useRouter();

  const [snackBarData, setSnackBarData] = useState({
    content: "",
    open: false,
    severity: "",
  });

  const handleLeaveClass = () => {
    setIsLeaveClassBtnSpinning(true);
    setIsConfirmBoxVisible(false);

    const data = {
      classId: params.classId,
      userId: user._id,
      status: "REMOVE_MEMBER",
    };

    const api = `classes/remove-member`;
    instance
      .post(api, data, getApiConfig())
      .then(() => {
        setSnackBarData(() => ({
          content: "Rời lớp học thành công",
          severity: "success",
          open: true,
        }));
        router.push("/k-learning");
      })
      .catch((err) => {
        console.log(err);
        setSnackBarData(() => ({
          content: "Đã xảy ra lỗi!",
          severity: "error",
          open: true,
        }));
      })
      .finally(() => {
        setIsLeaveClassBtnSpinning(false);
      });
  };

  return (
    <Fragment>
      {overviewData == "loading" ? (
        <div className="flex-1 flex items-center justify-center">
          <CustomCircularProgress />
        </div>
      ) : overviewData == "not_found" ? (
        <div className="flex-1 flex items-center justify-center">
          <Custom404 />
        </div>
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

          <div className="sticky top-0 left-0 bg-gray-100 p-2 flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href={`/k-learning/${params.classId}/members`}
                className="flex items-center justify-center"
              >
                <IconButton title="Tất cả thành viên">
                  <ChevronLeft />
                </IconButton>
              </Link>
              <span className="ml-2 text-red-500 font-medium">
                {overviewData.member.username}
              </span>
            </div>
            {params.memberId === user._id && (
              <ConfirmBox
                visible={isConfirmBoxVisible}
                onCancel={() => {
                  setIsConfirmBoxVisible(false);
                }}
                onConfirm={handleLeaveClass}
              >
                <Button
                  onClick={() => {
                    setIsConfirmBoxVisible(true);
                  }}
                  style={{ minWidth: "115px" }}
                  variant="outlined"
                  color="error"
                >
                  {isLeaveClassBtnSpinning ? (
                    <CircularProgress size={22} className="text-gray-500" />
                  ) : (
                    <Fragment>
                      Rời lớp học <ExitToAppOutlined className="ml-2" />
                    </Fragment>
                  )}
                </Button>
              </ConfirmBox>
            )}
          </div>
          <div className="border-2 border-sky-50 p-3">
            <PieChart
              series={[
                {
                  data: [
                    {
                      id: 0,
                      value: overviewData.totalOfCompletedExaminations,
                      label: "Bài thi đã hoàn thành",
                      // color: "yellow",
                    },
                    {
                      id: 1,
                      value:
                        overviewData.totalOfExaminations -
                        overviewData.totalOfCompletedExaminations,
                      label: "Bài thi cần hoàn thành",
                      // color: "orange",
                    },
                  ],
                },
              ]}
              width={600}
              height={200}
            />
          </div>
          <ul className="p-2 pt-0">
            {overviewData.examOverviews.map((examOverview, index) => {
              return (
                <li
                  key={examOverview.lesson._id}
                  className={`mt-2 rounded-lg border-2 border-slate-100 p-2 flex items-center justify-between ${
                    examOverview.lesson.coefficient == 0
                      ? "bg-gray-100"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="rounded-full p-1 flex items-center justify-center text-red-500 font-semibold">
                      {index + 1}
                    </div>
                    <div className="ml-2">{examOverview.lesson.name}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="mr-2">
                      Hệ số điểm: {examOverview.lesson.coefficient}
                    </div>

                    <div className="flex items-center justify-end">
                      {examOverview.score ? (
                        <div
                          className={`rounded-lg text-gray-50 p-1 ${
                            examOverview.score.score >= 5
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {examOverview.score.score}
                        </div>
                      ) : (
                        <ReportProblemOutlined className="text-red-500" />
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
            <li className="mt-2 rounded-lg border-0 border-slate-100 p-2 flex items-center justify-end ">
              <div className="text-red-500 font-semibold">
                Điểm trung bình: {overviewData.cpa}
              </div>
            </li>
          </ul>
        </div>
      )}
    </Fragment>
  );
}

export default MemberInfo;
