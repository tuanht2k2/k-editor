"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Link from "next/link";

import {
  AttributionOutlined,
  ClearOutlined,
  DoneOutline,
  ManageAccountsOutlined,
  PersonRemoveOutlined,
} from "@mui/icons-material";
import { CircularProgress, IconButton } from "@mui/material";

import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";

import Custom404 from "@/app/components/Custom404";
import CustomCircularProgress from "@/app/components/CustomCircularProgress";

import CustomSnackBar from "@/app/components/CustomSnackBar";
import ConfirmBox from "@/app/components/ConfirmBox";

function Members({ params }) {
  const currentUser = useSelector((state) => state.user);

  const [members, setMembers] = useState("loading");

  const [spinningBtnId, setSpinningBtnId] = useState("");

  const [snackBarData, setSnackBarData] = useState({
    content: "",
    open: false,
    severity: "",
  });

  const [visibleConfirmBoxId, setVisibleConfirmBoxId] = useState(false);

  const handleManageMember = (type, uid) => {
    setSpinningBtnId(uid);

    const data = { classId: params.classId, userId: uid, status: type };

    let api = "";

    switch (type) {
      case "ADD_MEMBER":
        api = `classes/add-member`;
        instance
          .post(api, data, getApiConfig())
          .then((res) => {
            setMembers(res.data);
            setSnackBarData(() => ({
              content: "Thành viên đã được duyệt vào lớp học!",
              severity: "success",
              open: true,
            }));
          })
          .catch(() => {
            setSnackBarData(() => ({
              content: "Đã xảy ra lỗi!",
              severity: "error",
              open: true,
            }));
          })
          .finally(() => {
            setSpinningBtnId("");
          });
        break;
      case "REMOVE_REQUEST":
        api = `classes/remove-request`;
        instance
          .post(api, data, getApiConfig())
          .then((res) => {
            setMembers(res.data);
            setSnackBarData(() => ({
              content: "Từ chối yêu cầu thành công",
              severity: "success",
              open: true,
            }));
          })
          .catch(() => {
            setSnackBarData(() => ({
              content: "Đã xảy ra lỗi",
              severity: "error",
              open: true,
            }));
          })
          .finally(() => {
            setSpinningBtnId("");
          });
        break;
      case "REMOVE_MEMBER":
        api = `classes/remove-member`;
        instance
          .post(api, data, getApiConfig())
          .then((res) => {
            setMembers(res.data);
            setSnackBarData(() => ({
              content: "Xóa thành viên thành công",
              severity: "success",
              open: true,
            }));
          })
          .catch((err) => {
            setSnackBarData(() => ({
              content: "Đã xảy ra lỗi!",
              severity: "error",
              open: true,
            }));
          });
        break;
      default:
        break;
    }
  };

  const handleGetMembers = () => {
    const api = `classes/${params.classId}/members`;

    instance
      .get(api, getApiConfig())
      .then((res) => {
        setMembers(res.data);
        console.log(res.data);
      })
      .catch(() => {
        setMembers("not_found");
      });
  };

  useEffect(() => {
    if (Object.keys(currentUser).length == 0) return () => {};

    handleGetMembers();

    return () => {};
  }, [currentUser]);

  return (
    <div className="flex items-center justify-center flex-1 flex-col">
      {members == "loading" ? (
        <CustomCircularProgress />
      ) : members == "not_found" ? (
        <Custom404 />
      ) : (
        <div className="w-full flex-1">
          <CustomSnackBar
            content={snackBarData.content}
            severity={snackBarData.severity}
            open={snackBarData.open}
            onCLose={() => {
              setSnackBarData((prev) => ({ ...prev, open: false }));
            }}
          />
          {members.requests.length > 0 &&
            members.ownerId == currentUser._id && (
              <div className="mb-3 border-2 border-sky-100">
                <div className="w-full bg-gray-100 p-2 pl-4 text-orange-500 font-medium">
                  {`Yêu cầu tham gia (${members.requests.length})`}
                </div>
                <ul className="flex flex-col p-3 pt-0">
                  {members.requests.map((user) => {
                    return (
                      <li
                        key={`request_${user._id}`}
                        className="mt-2 border-2 border-slate-100 rounded-xl p-1 flex justify-between"
                      >
                        <div className="flex items-center">
                          <img
                            className="rounded-full h-9 w-9 object-cover"
                            src={
                              user.profileImage ||
                              "/assets/images/profile_image.png"
                            }
                          />
                          <span className="ml-2">{user.username}</span>
                        </div>
                        <div className="flex items-center justify-center">
                          {spinningBtnId == user._id ? (
                            <CircularProgress size={25} className="mr-4" />
                          ) : (
                            <div className="flex items-center">
                              <button
                                className="bg-green-500 rounded-lg p-1 hover:bg-green-600 duration-300 text-sm"
                                onClick={() => {
                                  handleManageMember("ADD_MEMBER", user._id);
                                }}
                              >
                                <DoneOutline className="text-gray-200" />
                              </button>
                              <button
                                className="ml-4 bg-red-500 rounded-lg p-1 hover:bg-red-600 duration-300 text-sm"
                                onClick={() => {
                                  handleManageMember(
                                    "REMOVE_REQUEST",
                                    user._id
                                  );
                                }}
                              >
                                <ClearOutlined className="text-gray-200" />
                              </button>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          <div className="border-2 border-sky-100">
            <div className="w-full bg-gray-100 p-2 pl-4 text-orange-500 font-medium">
              {`Danh sách thành viên (${members.members.length})`}
            </div>
            {members.members.length > 0 ? (
              <ul className="flex flex-col p-3 pt-0">
                {members.members.map((user) => {
                  return (
                    <li
                      key={`request_${user._id}`}
                      className="mt-2 border-2 border-slate-100 rounded-xl p-1 flex justify-between group"
                    >
                      <div className="flex items-center">
                        <img
                          className="rounded-full h-9 w-9 object-cover"
                          src={
                            user.profileImage ||
                            "/assets/images/profile_image.png"
                          }
                        />
                        <span className="ml-2">{user.username}</span>
                      </div>
                      {currentUser._id == members.ownerId && (
                        <div className="flex items-center justify-center group-hover:visible invisible duration-75">
                          <Link
                            href={`/k-learning/${members.classId}/member-overview/${user._id}`}
                          >
                            <IconButton
                              className=""
                              title="Xem thông tin thành viên"
                            >
                              <ManageAccountsOutlined className="text-sky-500" />
                            </IconButton>
                          </Link>
                          <ConfirmBox
                            visible={visibleConfirmBoxId == user._id}
                            onCancel={() => {
                              setVisibleConfirmBoxId("");
                            }}
                            onConfirm={() => {
                              handleManageMember("REMOVE_MEMBER", user._id);
                              setVisibleConfirmBoxId("");
                            }}
                          >
                            <IconButton
                              className="ml-2"
                              title="Xóa thành viên"
                              onClick={() => {
                                setVisibleConfirmBoxId(user._id);
                              }}
                            >
                              <PersonRemoveOutlined className="text-red-500" />
                            </IconButton>
                          </ConfirmBox>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <span className="p-4 block">Lớp học chưa có thành viên nào</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Members;
