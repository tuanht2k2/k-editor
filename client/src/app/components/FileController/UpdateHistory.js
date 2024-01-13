"use client";

import {
  AutorenewOutlined,
  CloseOutlined,
  ExpandCircleDownOutlined,
  HistoryOutlined,
  RemoveOutlined,
  RestoreOutlined,
  UpdateOutlined,
} from "@mui/icons-material";

import { useState, useEffect } from "react";

import { over } from "stompjs";
import SockJS from "sockjs-client";

import dateFormat from "dateformat";

import parser from "html-react-parser";

import { IconButton } from "@mui/material";

import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";

import SheetUpdateDetails from "../SheetUpdateDetails";
import RegularTippy from "../RegularTippy";

function UpdateHistory({ file }) {
  const [updateHistoryData, setUpdateHistoryData] = useState({
    isVisble: false,
    data:
      file.format == "txt"
        ? [...(file.updateHistory || [])].reverse()
        : [...(file.sheetUpdateHistory || [])].reverse(),
  });

  // user who edits file
  const [users, setUsers] = useState(null);

  // const [isPageLoaded, setIsPageLoaded] = useState(false);

  // specific update id which is visibled
  const [updateHistoryTippy, setUpdateHistoryTippy] = useState({
    indexVisible: null,
    updates: null, // for sheet
  });

  const handleCollapseUpdateHistory = () => {
    setUpdateHistoryData((prev) => ({
      ...prev,
      isVisble: !prev.isVisble,
    }));
    setUpdateHistoryTippy((prev) => ({ ...prev, indexVisible: null }));
  };

  useEffect(() => {
    if (!file) return;
    const socket = new SockJS(
      "http://localhost:8080/ws",
      // "https://k-editor-service.onrender.com/ws",
      getApiConfig()
    );
    const client = over(socket);
    client.connect({}, () => {
      client.subscribe(
        `/documents/${file.format == "txt" ? "k-word" : "k-sheet"}/${file._id}`,
        (res) => {
          const resUpdates = JSON.parse(res.body);
          setUpdateHistoryData((prev) => ({
            ...prev,
            data: [...resUpdates].reverse(),
          }));
        }
      );
    });

    return () => {
      client.connected && client.disconnect();
    };
  }, [file]);

  const handleGetUsers = () => {
    if (!file.updateHistory && !file.sheetUpdateHistory) {
      setIsPageLoaded(true);
      return;
    }

    const config = getApiConfig();
    const history = file.updateHistory || file.sheetUpdateHistory || [];
    const uidList = history.map((update) => update.userId);
    const api = `/users/getallbyids`;

    instance
      .post(api, uidList, config)
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err))
      .finally(() => setIsPageLoaded(true));
  };

  return (
    <div>
      <RegularTippy
        render={
          <div>
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-600">
                Lịch sử chỉnh sửa
              </div>
              <div className="flex items-center">
                <IconButton className="ml-5" onClick={null} title="Tải lại">
                  <AutorenewOutlined className="text-sky-500 text-md" />
                </IconButton>
                <IconButton
                  className="ml-5"
                  onClick={handleCollapseUpdateHistory}
                  title="Đóng"
                >
                  <CloseOutlined className="text-slate-400 text-md" />
                </IconButton>
              </div>
            </div>
            {updateHistoryData.data.length > 0 ? (
              // render update list
              <ul
                className="mt-2 max-h-52 overflow-y-scroll border-b-2 border-t-2 border-slate-200"
                onScroll={() => {
                  setUpdateHistoryTippy((prev) => ({
                    ...prev,
                    indexVisible: null,
                  }));
                }}
              >
                {updateHistoryData.data.map((update, index) => {
                  return (
                    <li
                      key={`txt_update_${index}`}
                      className="p-2 border-t-2 border-slate-200 flex items-center justify-between select-none"
                    >
                      <div className="flex items-center">
                        <img
                          className="w-6 h-6 rounded-full object-cover"
                          src={
                            update.user.profileImage
                              ? update.user.profileImage
                              : "/assets/images/profile_image.png"
                          }
                        />
                        <span className="ml-2 text-sm font-semibold text-slate-600">
                          {update.user.username}
                        </span>
                        <span className="ml-2 text-sm font-semibold italic text-slate-400">{`đã sửa đổi ${dateFormat(
                          update.time
                        )}`}</span>
                      </div>

                      {/* render update details */}
                      <RegularTippy
                        placement={"bottom"}
                        visible={index == updateHistoryTippy.indexVisible}
                        render={
                          file.format === "txt" ? ( // history of txt file
                            <div className="bg-white rounded-md border-2 border-slate-300 p-4">
                              <div className="flex items-center justify-between pb-2 border-b-2 border-slate-300 font-semibold">
                                <div className="flex items-center text-sm font-semibold italic text-slate-400">
                                  <img
                                    className="w-6 h-6 rounded-full object-cover"
                                    src={"/assets/images/profile_image.png"}
                                  />
                                  <span className="ml-2 mr-2 text-sm font-semibold text-slate-600">
                                    {update.user.username}
                                  </span>
                                  {`đã sửa đổi ${dateFormat(update.time)}`}
                                </div>
                                <IconButton
                                  className="ml-4"
                                  onClick={() => {
                                    setUpdateHistoryTippy((prev) => ({
                                      ...prev,
                                      indexVisible: null,
                                    }));
                                  }}
                                  title="Đóng"
                                >
                                  <RemoveOutlined className="text-slate-400 text-xs" />
                                </IconButton>
                              </div>
                              {/*txt update details */}
                              <div className="">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="flex mt-2 mb-2">
                                    <h1 className="font-semibold text-slate-500">
                                      Trước khi chỉnh sửa
                                    </h1>
                                    <RestoreOutlined className="text-red-800 ml-2 text-sm" />
                                  </div>
                                  <div className="flex mt-2 mb-2">
                                    <h1 className="font-semibold text-slate-500">
                                      Sau khi chỉnh sửa
                                    </h1>
                                    <UpdateOutlined className="text-sky-600 ml-2 text-sm" />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="p-3 border-2 border-slate-200 rounded-md text-sm overflow-scroll">
                                    {parser(
                                      updateHistoryData.data[1]?.data || ""
                                    )}
                                  </div>

                                  <div className="p-3 border-2 border-slate-200 rounded-md text-sm overflow-scroll">
                                    {parser(update.data)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null
                        }
                      >
                        <button
                          className={`ml-2 flex items-center justify-center p-1 rounded-full ${
                            index == updateHistoryTippy.indexVisible
                              ? "bg-slate-100"
                              : "hover:bg-slate-100"
                          }  `}
                          onClick={() =>
                            setUpdateHistoryTippy((prev) => ({
                              updates:
                                file.format === "txt" ? null : update.actions,
                              indexVisible:
                                file.format === "txt"
                                  ? prev.indexVisible == index
                                    ? null
                                    : index
                                  : "sheet",
                            }))
                          }
                        >
                          <ExpandCircleDownOutlined
                            className={
                              index == updateHistoryTippy.indexVisible
                                ? "text-sky-500"
                                : "text-sky-700"
                            }
                            titleAccess="Kiểm tra"
                          />
                        </button>
                      </RegularTippy>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex">
                <span className="mt-4 text-slate-400">
                  Chưa có chỉnh sửa nào
                </span>
              </div>
            )}
          </div>
        }
        placement={"bottom"}
        visible={updateHistoryData.isVisble}
      >
        <IconButton
          className={`${updateHistoryData.isVisble && "bg-slate-200"}`}
          onClick={handleCollapseUpdateHistory}
        >
          <HistoryOutlined
            className={`${
              updateHistoryData.isVisble ? "text-sky-400" : "text-sky-600"
            }`}
            titleAccess="Xem lịch sử chỉnh sửa"
          />
        </IconButton>
      </RegularTippy>

      {/* render sheet update history */}
      <SheetUpdateDetails
        open={updateHistoryTippy.indexVisible === "sheet"}
        onClose={() => {
          setUpdateHistoryTippy(() => ({
            indexVisible: null,
            updateArgsObj: null,
          }));
        }}
        updates={updateHistoryTippy.updates}
      />
    </div>
  );
}

export default UpdateHistory;
