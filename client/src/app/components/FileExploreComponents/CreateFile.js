import { useState } from "react";
import { useSelector } from "react-redux";

import {
  AbcOutlined,
  AutoModeOutlined,
  GridOn,
  NoteAddOutlined,
  PasswordOutlined,
  TextSnippetOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";
import CustomSnackBar from "../CustomSnackBar";

function CreateFile({ componentType, fileExplore, handleReload }) {
  const user = useSelector((state) => state.user);

  const [createFileFormData, setCreateFileFormData] = useState({
    name: "",
    password: "",
    isBtnSpinning: false,
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleCreateFile = (
    ownerId,
    parentFolderId,
    name,
    password,
    format
  ) => {
    setCreateFileFormData((pre) => ({ ...pre, isBtnSpinning: true }));
    const fileObj = {
      ownerId,
      parentFolderId,
      name,
      password,
      format,
      data: "",
      createdAt: new Date(),
    };

    // for k-word
    const config = getApiConfig();

    instance
      .post("/files/create", fileObj, config)
      .then(() => {
        handleReload();
        setIsSnackBarVisible(true);
        setCreateFileFormData((prev) => ({ ...prev, name: "", password: "" }));
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
      <h1 className="font-bold text-sm sm:text-lg">
        Tạo tài liệu mới
        <NoteAddOutlined color="primary" className="ml-2" />
      </h1>

      <div className="sm:p-3">
        <div className="font-semibold mt-2 ">
          <span className="text-sm sm:text-base">
            Tạo tài liệu mới trong thư mục
            <span className="text-red-500 italic underline">
              {fileExplore.folders?.folder
                ? ` ${fileExplore.folders.folder.name}`
                : " gốc"}{" "}
            </span>
            (Mật khẩu là tùy chọn)
          </span>
        </div>
        <div className="flex flex-col mt-2">
          <div className="w-full sm:w-4/6 md:w-5/6 lg:w-4/6">
            <TextField
              fullWidth
              placeholder="Nhập tên tài liệu..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AbcOutlined
                      className={`${
                        componentType == "k-word"
                          ? "text-sky-600"
                          : "text-green-600"
                      }`}
                    />
                  </InputAdornment>
                ),
              }}
              value={createFileFormData.name}
              onChange={(e) => {
                setCreateFileFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }}
              onKeyDown={(e) => {
                e.key == "Enter" &&
                  handleCreateFile(
                    user._id,
                    fileExplore.folders?.folder
                      ? fileExplore.folders.folder._id
                      : "root",
                    createFileFormData.name,
                    createFileFormData.password,
                    componentType == "k-word" ? "txt" : "xlsx"
                  );
              }}
              error={!createFileFormData.name.trim()}
            />
          </div>
          <div className="mt-2 w-full sm:w-4/6 md:w-5/6 lg:w-4/6">
            <TextField
              fullWidth
              placeholder="Nhập mật khẩu tài liệu..."
              value={createFileFormData.password}
              type={isPasswordVisible ? "text" : "password"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PasswordOutlined
                      className={`${
                        componentType == "k-word"
                          ? "text-sky-600"
                          : "text-green-600"
                      }`}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {
                        setIsPasswordVisible((prev) => !prev);
                      }}
                      edge="end"
                    >
                      {!isPasswordVisible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                setCreateFileFormData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
              onKeyDown={(e) => {
                e.key == "Enter" &&
                  handleCreateFile(
                    user._id,
                    fileExplore.folders?.folder
                      ? fileExplore.folders.folder._id
                      : "root",
                    createFileFormData.name,
                    createFileFormData.password,
                    componentType == "k-word" ? "txt" : "xlsx"
                  );
              }}
            />
          </div>
          <div className="flex items-center mt-3">
            <div className="mr-3">
              <Button
                variant="outlined"
                color={componentType == "k-word" ? "info" : "success"}
                style={{ minWidth: "115px" }}
                disabled={!createFileFormData.name.trim()}
                onClick={() => {
                  handleCreateFile(
                    user._id,
                    fileExplore.folders?.folder
                      ? fileExplore.folders.folder._id
                      : "root",
                    createFileFormData.name,
                    createFileFormData.password,
                    componentType == "k-word" ? "txt" : "xlsx"
                  );
                }}
              >
                {createFileFormData.isBtnSpinning ? (
                  <AutoModeOutlined className="animate-spin" />
                ) : (
                  "Tạo mới"
                )}
              </Button>
            </div>
            <div className="flex h-full items-center">
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
                  <span className="text-md font-semibold text-sky-600">
                    .txt
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateFile;
