import {
  ContentCopy,
  DownloadOutlined,
  GridOn,
  MessageOutlined,
  ShareOutlined,
  TextSnippetOutlined,
} from "@mui/icons-material";

import RegularTippy from "../RegularTippy";
import { Fragment, useState } from "react";

import { Alert, IconButton, Snackbar } from "@mui/material";

import TemporaryMessenger from "../TemporaryMessenger";

import UpdateHistory from "./UpdateHistory";

function DocumentController({ file, wordFn, sheetFn }) {
  // share file
  const [isShareVisible, setIsShareVisible] = useState(false);
  const [isCopySnackBarVisible, setIsCopySnackBarVisible] = useState(false);

  const [isTemporaryMessengerVisible, setIsTemporaryMessengerVisible] =
    useState(false);

  return (
    <div className="pt-1 pb-4 flex items-center justify-between">
      <div className="flex items-center">
        {file.format === "txt" ? (
          <TextSnippetOutlined className="text-sky-600" />
        ) : (
          <GridOn className="text-green-600" />
        )}
        <span className="ml-2 font-semibold italic">{`${file.name}.${file.format}`}</span>
      </div>
      {/* file action */}
      <div className="flex items-center justify-end">
        {file.format === "txt" && (
          <IconButton
            style={{ marginRight: "10px" }}
            onClick={wordFn || sheetFn}
            title="Tải xuống dưới dạng pdf"
            className="mr-4"
          >
            <DownloadOutlined
              className={`${
                file.format === "txt" ? "text-sky-500" : "text-green-500"
              } `}
            />
          </IconButton>
        )}

        {/* messenger */}
        <RegularTippy
          render={
            <TemporaryMessenger
              document={file}
              hideWindowFn={() => {
                setIsTemporaryMessengerVisible(false);
              }}
            />
          }
          visible={isTemporaryMessengerVisible}
          placement={"bottom-end"}
        >
          <IconButton
            style={{ marginRight: "10px" }}
            className={`mr-3 ${isTemporaryMessengerVisible && "bg-slate-200 "}`}
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
          </IconButton>
        </RegularTippy>

        {/* update history */}
        <UpdateHistory file={file} />

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
                  {file._id}
                </span>
                <IconButton
                  size="small"
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                    navigator.clipboard.writeText(file._id);
                    setIsCopySnackBarVisible(true);
                  }}
                  title="Copy"
                >
                  <ContentCopy fontSize="0.8rem" className="text-blue-400" />
                </IconButton>
              </div>
            </Fragment>
          )}
          <IconButton
            style={{ marginRight: "10px" }}
            className={`m-2 ${isShareVisible && "bg-slate-200"}`}
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
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default DocumentController;
