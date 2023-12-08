import {
  CachedOutlined,
  CloseOutlined,
  ContentCopy,
  ExpandCircleDownOutlined,
  GridOn,
  HistoryOutlined,
  MessageOutlined,
  RemoveOutlined,
  RestoreOutlined,
  ShareOutlined,
  TextSnippetOutlined,
  UpdateOutlined,
} from "@mui/icons-material";

import parser from "html-react-parser";

import RegularTippy from "./RegularTippy";
import { Fragment, useEffect, useRef, useState } from "react";

import getApiConfig from "../utils/getApiConfig";
import { instance } from "../utils/axios";

import dateFormat from "dateformat";
import { Alert, Snackbar } from "@mui/material";
import TemporaryMessenger from "./TemporaryMessenger";
import SheetUpdateDetails from "./SheetUpdateDetails";
import { SpreadsheetComponent } from "@syncfusion/ej2-react-spreadsheet";

function DocumentController({ document, reload }) {
  const [updateHistoryData, setUpdateHistoryData] = useState({
    isVisble: false,
    data:
      document.format == "txt"
        ? [...(document.updateHistory || [])].reverse()
        : [...(document.sheetUpdateHistory || [])].reverse(),
  });

  const spreadsheetRef1 = useRef(null);

  // user who edits document
  const [users, setUsers] = useState(null);

  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // specific update id which is visibled
  const [updateHistoryTippy, setUpdateHistoryTippy] = useState({
    indexVisible: null,
    updateArgsObj: null,
  });

  // share document
  const [isShareVisible, setIsShareVisible] = useState(false);
  const [isCopySnackBarVisible, setIsCopySnackBarVisible] = useState(false);

  const [isTemporaryMessengerVisible, setIsTemporaryMessengerVisible] =
    useState(false);

  const handleGetUsers = () => {
    if (!document.updateHistory && !document.sheetUpdateHistory) {
      setIsPageLoaded(true);
      return;
    }

    const config = getApiConfig();
    const history = document.updateHistory || document.sheetUpdateHistory || [];
    const uidList = history.map((update) => update.userId);
    const api = `/users/getallbyids`;

    instance
      .post(api, uidList, config)
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err))
      .finally(() => setIsPageLoaded(true));
  };

  const handleCollapseUpdateHistory = () => {
    setUpdateHistoryData((prev) => ({
      ...prev,
      isVisble: !prev.isVisble,
    }));
    setUpdateHistoryTippy((prev) => ({ ...prev, indexVisible: null }));
  };

  useEffect(() => {
    handleGetUsers();
  }, [document]);

  useEffect(() => {
    if (!updateHistoryData.isVisble) return;
    // bug
    reload();
  }, [updateHistoryData.isVisble]);

  return (
    <div className="pt-4 pb-4 flex items-center justify-between">
      <div className="flex items-center">
        {document.format === "txt" ? (
          <TextSnippetOutlined className="text-sky-600" />
        ) : (
          <GridOn className="text-green-600" />
        )}
        <span className="ml-2 font-semibold italic">{`${document.name}.${document.format}`}</span>
      </div>
      {/* document action */}
      <div className="flex items-center justify-end">
        {/* messenger */}
        <RegularTippy
          render={
            <TemporaryMessenger
              document={document}
              hideWindowFn={() => {
                setIsTemporaryMessengerVisible(false);
              }}
            />
          }
          visible={isTemporaryMessengerVisible}
          placement={"bottom-end"}
        >
          <button
            className={`flex justify-center items-center mr-3 cursor-pointer p-2 duration-300 hover:bg-slate-200 rounded-full ${
              isTemporaryMessengerVisible && "bg-slate-200 "
            }`}
            onClick={() => {
              setIsTemporaryMessengerVisible((prev) => !prev);
            }}
          >
            <MessageOutlined
              className={`${
                isTemporaryMessengerVisible ? "text-sky-400" : "text-sky-600"
              }`}
              titleAccess="Mở cuộc họp"
            />
          </button>
        </RegularTippy>

        {/* update history */}
        <div>
          <RegularTippy
            render={
              <div>
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-600">
                    Lịch sử chỉnh sửa
                  </div>
                  {/* <button
                className="ml-5 p-1 flex items-center justify-center rounded-full duration-300 cursor-pointer bg-slate-50 hover:bg-slate-200"
                onClick={handleCollapseUpdateHistory}
                title="Tải lại"
              >
                <CachedOutlined
                  className="text-slate-400 text-md"
                  
                />
              </button> */}
                  <button
                    className="ml-5 p-1 flex items-center justify-center rounded-full duration-300 cursor-pointer bg-slate-50 hover:bg-slate-200"
                    onClick={handleCollapseUpdateHistory}
                    title="Đóng"
                  >
                    <CloseOutlined className="text-slate-400 text-md" />
                  </button>
                </div>
                {updateHistoryData.data.length > 0 && users ? (
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
                      const user = users.find(
                        (user) => user?._id == update.userId
                      );
                      return (
                        <li
                          key={`txt_update_${index}`}
                          className="p-2 border-t-2 border-slate-200 flex items-center justify-between select-none"
                        >
                          <div className="flex items-center">
                            <img
                              className="w-6 h-6 rounded-full object-cover"
                              src={"/assets/images/profile_image.png"}
                            />
                            <span className="ml-2 text-sm font-semibold text-slate-600">
                              {user.username}
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
                              document.format === "txt" ? ( // history of txt file
                                <div className="bg-white rounded-md border-2 border-slate-300 p-4">
                                  <div className="flex items-center justify-between pb-2 border-b-2 border-slate-300 font-semibold">
                                    <div className="flex items-center text-sm font-semibold italic text-slate-400">
                                      <img
                                        className="w-6 h-6 rounded-full object-cover"
                                        src={"/assets/images/profile_image.png"}
                                      />
                                      <span className="ml-2 mr-2 text-sm font-semibold text-slate-600">
                                        {user.username}
                                      </span>
                                      {`đã sửa đổi ${dateFormat(update.time)}`}
                                    </div>
                                    <button
                                      className="ml-4 flex items-center justify-center rounded-full duration-300 cursor-pointer bg-slate-50 hover:bg-slate-200"
                                      onClick={() => {
                                        setUpdateHistoryTippy((prev) => ({
                                          ...prev,
                                          indexVisible: null,
                                        }));
                                      }}
                                      title="Đóng"
                                    >
                                      <RemoveOutlined className="text-slate-400 text-xs" />
                                    </button>
                                  </div>
                                  {/* update details */}
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
                                      <div className="p-3 border-2 border-slate-200 rounded-md text-sm">
                                        {parser(
                                          updateHistoryData.data[index - 1]
                                            ?.data || ""
                                        )}
                                      </div>

                                      <div className="p-3 border-2 border-slate-200 rounded-md text-sm">
                                        {parser(update.data)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                // <FileUpdateDetails
                                //   updateArgsObj={JSON.parse(
                                //     update.updateArgsObj
                                //   )}
                                // />
                                <div></div>
                              )
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
                                  ...prev,
                                  indexVisible:
                                    prev.indexVisible == index ? null : index,
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
                ) : isPageLoaded && updateHistoryData.data.length == 0 ? (
                  <div className="flex">
                    <span className="mt-4 text-slate-400">
                      Chưa có chỉnh sửa nào
                    </span>
                  </div>
                ) : (
                  <div>
                    <CachedOutlined className="animate-spin" />
                  </div>
                )}
              </div>
            }
            placement={"bottom"}
            visible={updateHistoryData.isVisble}
          >
            <button
              className={`p-2 flex justify-center items-center ml-3 mr-3 cursor-pointer duration-300 hover:bg-slate-200 rounded-full ${
                updateHistoryData.isVisble && "bg-slate-200"
              }`}
              onClick={handleCollapseUpdateHistory}
            >
              <HistoryOutlined
                className={`${
                  updateHistoryData.isVisble ? "text-sky-400" : "text-sky-600"
                }`}
                titleAccess="Xem lịch sử chỉnh sửa"
              />
            </button>
          </RegularTippy>

          {/* render sheet update history */}
          <RegularTippy
            render={
              <div>
                <SpreadsheetComponent ref={spreadsheetRef1} />
              </div>
            }
            // visible={updateHistoryTippy.indexVisible === "sheetUpdateVisible"}
            // visible={true}
            visible={false}
          >
            <span></span>
          </RegularTippy>
        </div>
        {/* share */}
        <div className="flex items-center">
          {isShareVisible && (
            <Fragment>
              <Snackbar
                open={isCopySnackBarVisible}
                autoHideDuration={3000}
                onClose={() => {
                  setIsCopySnackBarVisible(false);
                }}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Alert
                  onClose={() => {
                    setIsCopySnackBarVisible(false);
                  }}
                  severity="info"
                  sx={{ width: "100%" }}
                >
                  Đã sao chép ID tài liệu vào bộ nhớ tạm
                </Alert>
              </Snackbar>
              <div className="flex border-2 border-slate-200 rounded-md p-2">
                <span className="flex items-center mr-2 text-xs font-semibold">
                  ID:
                </span>
                <span className="flex items-center font-semibold text-xs text-blue-800">
                  {document._id}
                </span>
                <button
                  className="ml-2 p-1 flex items-center justify-center rounded-full duration-300 cursor-pointer hover:bg-slate-200"
                  onClick={() => {
                    navigator.clipboard.writeText(document._id);
                    setIsCopySnackBarVisible(true);
                  }}
                  title="Copy"
                >
                  <ContentCopy fontSize="0.8rem" className="text-blue-400" />
                </button>
              </div>
            </Fragment>
          )}
          <button
            className={`m-2 p-2 flex items-center justify-center rounded-full duration-300 cursor-pointer hover:bg-slate-200 ${
              isShareVisible && "bg-slate-200"
            }`}
            onClick={() => {
              setIsShareVisible((prev) => !prev);
            }}
            title="Chia sẻ"
          >
            <ShareOutlined
              className={`${
                isShareVisible ? "text-green-400" : "text-green-600"
              }`}
              fontSize="small"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocumentController;
