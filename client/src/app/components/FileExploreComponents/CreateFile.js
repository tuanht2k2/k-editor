import { useState } from "react";
import { useSelector } from "react-redux";

import {
  CachedOutlined,
  GridOn,
  NoteAddOutlined,
  TextSnippetOutlined,
} from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";
import CustomSnackBar from "../CustomSnackBar";

function CreateFile({ componentType, fileExplore, handleReload }) {
  const user = useSelector((state) => state.user);

  const [createFileFormData, setCreateFileFormData] = useState({
    value: "",
    isBtnSpinning: false,
  });

  const handleCreateFile = (ownerId, parentFolderId, name, format) => {
    setCreateFileFormData((pre) => ({ ...pre, isBtnSpinning: true }));
    const fileObj = {
      ownerId,
      parentFolderId,
      name,
      format,
      data: "",
      createdAt: new Date(),
    };

    // for k-word
    const config = getApiConfig();

    instance
      .post("/files/create", fileObj, config)
      .then((res) => {
        handleReload();
        setIsSnackBarVisible(true);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() =>
        setCreateFileFormData((prev) => ({
          ...prev,
          value: "",
          isBtnSpinning: false,
        }))
      );
  };

  const [isSnackBarVisible, setIsSnackBarVisible] = useState(false);

  return (
    <div className="border-slate-200 border-2 p-5 rounded-xl">
      <CustomSnackBar
        open={isSnackBarVisible}
        onCLose={() => {
          setIsSnackBarVisible(false);
        }}
        content={"Tạo file thành công!"}
        severity={"success"}
      />
      <h1 className="font-bold flex items-center text-2xl">
        <span className="mr-2">Tạo tài liệu mới</span>
        <NoteAddOutlined color="primary" />
      </h1>
      <div className="p-3">
        <div className="font-semibold mt-2 ">
          <span className="">
            Đặt tên cho tài liệu của bạn( Tài liệu được tạo mới vào thư mục
          </span>
          <span className="underline italic ml-1 text-red-400">
            {fileExplore.folders?.folder
              ? ` ${fileExplore.folders.folder.name}`
              : " gốc"}
          </span>
          )
        </div>
        <div className="flex items-center mt-2">
          <TextField
            placeholder="Nhập tên tài liệu..."
            value={createFileFormData.value}
            onChange={(e) => {
              setCreateFileFormData((prev) => ({
                ...prev,
                value: e.target.value,
              }));
            }}
            onKeyDown={(e) => {
              e.key == "Enter" &&
                handleCreateFile(
                  user._id,
                  fileExplore.folders?.folder
                    ? fileExplore.folders.folder._id
                    : "root",
                  createFileFormData.value,
                  componentType == "k-word" ? "txt" : "xlsx"
                );
            }}
            error={!createFileFormData.value.trim()}
          />
          <div className="ml-3 mr-3">
            <Button
              variant="outlined"
              color={componentType == "k-word" ? "info" : "success"}
              style={{ minWidth: "115px" }}
              disabled={!createFileFormData.value.trim()}
              onClick={() => {
                handleCreateFile(
                  user._id,
                  fileExplore.folders?.folder
                    ? fileExplore.folders.folder._id
                    : "root",
                  createFileFormData.value,
                  componentType == "k-word" ? "txt" : "xlsx"
                );
              }}
            >
              {createFileFormData.isBtnSpinning ? (
                <CachedOutlined className="animate-spin" />
              ) : (
                "Tạo mới"
              )}
            </Button>
          </div>
          <div className="flex h-full">
            {componentType == "k-sheet" ? (
              <div className="flex items-center">
                <GridOn className="text-green-700" />
                <span className="text-md font-semibold text-green-700">
                  .xlsx
                </span>
              </div>
            ) : (
              <div className="flex items-center">
                <TextSnippetOutlined className="text-sky-600" />
                <span className="text-md font-semibold text-sky-600">.txt</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateFile;
