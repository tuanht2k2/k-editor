"use client";

import CustomSnackBar from "@/app/components/CustomSnackBar";
import YourClasses from "@/app/components/KLearning/YourClasses";
import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";
import {
  AbcOutlined,
  AutoModeOutlined,
  GroupAddOutlined,
  InputOutlined,
  PasswordOutlined,
  PinOutlined,
  SchoolOutlined,
} from "@mui/icons-material";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";

function KLearning() {
  const user = useSelector((state) => state.user);

  const [isClassCtrlVisible, setIsClassCtrVisible] = useState(false);

  const [accessClassFormData, setAccessClassFormData] = useState({
    idValue: "",
    isBtnSpinning: false,
  });

  const [createClassFormData, setCreateClassFormData] = useState({
    classnameValue: "",
    passwordValue: "",
    isBtnSpinning: false,
  });

  // create class
  const handleCreateClass = () => {
    if (Object.keys(user).length == 0) return;

    setCreateClassFormData((prev) => ({ ...prev, isBtnSpinning: true }));
    const api = `classes/create/user=${user._id}/classname=${createClassFormData.classnameValue}`;
    const data = { rawPassword: createClassFormData.passwordValue };
    instance
      .post(api, data, getApiConfig())
      .then(() => {
        setCreateClassFormData({
          isBtnSpinning: false,
          classnameValue: "",
          passwordValue: "",
        });
        setSnackBarData({
          content: "Tạo lớp học mới thành công!",
          severity: "success",
          open: true,
        });
      })
      .catch(() => {
        setSnackBarData({
          content: "Lớp học đã tồn tại!",
          severity: "error",
          open: true,
        });
        setCreateClassFormData((prev) => ({ ...prev, isBtnSpinning: false }));
      });
  };

  // snackbar
  const [snackBarData, setSnackBarData] = useState({
    content: "",
    open: false,
    severity: "",
  });

  return (
    <div className="p-5 w-full min-h-[calc(100vh-100px)] border-2 border-sky-300 rounded-xl">
      <CustomSnackBar
        content={snackBarData.content}
        severity={snackBarData.severity}
        open={snackBarData.open}
        onCLose={() => {
          setSnackBarData((prev) => ({ ...prev, open: false }));
        }}
      />
      <header className="pb-3 flex justify-between items-center border-b-2 border-slate-200">
        <div className="font-semibold text-xl border-b-2 border-sky-500 rounded-lg flex items-center">
          K-Learning <SchoolOutlined className="text-sky-500 ml-2" />
        </div>
        <div
          className="flex items-center border-2 border-slate-200 rounded-md p-1 cursor-pointer hover:bg-slate-100 duration-300 text-slate-500"
          onClick={() => {
            setIsClassCtrVisible((prev) => !prev);
          }}
        >
          <GroupAddOutlined className="text-sky-500 mr-2" />
          Tham gia hoặc tạo lớp học mới
        </div>
      </header>
      <div className="mt-4">
        <div className="flex item-center font-semibold text-lg text-slate-700">
          Tham gia hoặc tạo lớp học mới
          <GroupAddOutlined className="text-sky-500 ml-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-3 gap-2">
          <div className="border-slate-200 border-2 p-5 rounded-xl md:h-full">
            <h1 className="font-bold text-sm sm:text-lg">
              Tham gia lớp học
              <InputOutlined color="primary" className="ml-2" />
            </h1>
            <div className="sm:p-3">
              <div className="font-semibold mt-2">Nhập ID lớp học</div>
              <div className="flex flex-col mt-4 w-full sm:w-4/6 md:w-5/6">
                <TextField
                  placeholder="Nhập ID lớp học..."
                  value={accessClassFormData.idValue}
                  onChange={(e) => {
                    setAccessClassFormData((prev) => ({
                      ...prev,
                      idValue: e.target.value,
                    }));
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PinOutlined />
                      </InputAdornment>
                    ),
                  }}
                  onKeyDown={(e) => {
                    // e.key == "Enter" && handleAccessFile();
                  }}
                />
                <div className="flex items-center mt-3">
                  <div className="mr-3">
                    <Button variant="outlined" style={{ minWidth: "115px" }}>
                      {/* {accessFileFormData.isBtnSpinning ? (
                  <AutoModeOutlined className="animate-spin" />
                ) : (
                  "Truy cập"
                )} */}
                      Truy cập
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-slate-200 border-2 p-5 rounded-xl">
            <h1 className="font-bold text-sm sm:text-lg">
              Tạo lớp học mới
              <SchoolOutlined color="primary" className="ml-2" />
            </h1>

            <div className="sm:p-3">
              <span className="font-semibold mt-2 text-sm sm:text-base">
                Tạo lớp học mới (Mật khẩu là tùy chọn)
              </span>
              <div className="flex flex-col mt-2">
                <div className="w-full sm:w-4/6 md:w-5/6 lg:w-4/6">
                  <TextField
                    fullWidth
                    placeholder="Nhập tên lớp học..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AbcOutlined className="text-sky-600" />
                        </InputAdornment>
                      ),
                    }}
                    error={!createClassFormData.classnameValue.trim()}
                    value={createClassFormData.classnameValue}
                    onChange={(e) => {
                      setCreateClassFormData((prev) => ({
                        ...prev,
                        classnameValue: e.target.value,
                      }));
                    }}
                    onKeyDown={(e) => {
                      e.key == "Enter" &&
                        createClassFormData.classnameValue.trim() &&
                        handleCreateClass();
                    }}
                  />
                </div>
                <div className="mt-2 w-full sm:w-4/6 md:w-5/6 lg:w-4/6">
                  <TextField
                    fullWidth
                    placeholder="Nhập mật khẩu lớp học..."
                    // type={isPasswordVisible ? "text" : "password"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PasswordOutlined className="text-sky-500" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => {
                              // setIsPasswordVisible((prev) => !prev);
                            }}
                            edge="end"
                          >
                            {/* {!isPasswordVisible ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )} */}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    value={createClassFormData.passwordValue}
                    onChange={(e) => {
                      setCreateClassFormData((prev) => ({
                        ...prev,
                        passwordValue: e.target.value,
                      }));
                    }}
                    onKeyDown={(e) => {
                      e.key == "Enter" &&
                        createClassFormData.classnameValue.trim() &&
                        handleCreateClass();
                    }}
                  />
                </div>
                <div className="flex items-center mt-3">
                  <div className="mr-3">
                    <Button
                      variant="outlined"
                      style={{ minWidth: "115px" }}
                      onClick={
                        createClassFormData.classnameValue.trim()
                          ? handleCreateClass
                          : () => {}
                      }
                      disabled={!createClassFormData.classnameValue.trim()}
                    >
                      {createClassFormData.isBtnSpinning ? (
                        <AutoModeOutlined className="animate-spin" />
                      ) : (
                        "Tạo mới"
                      )}
                    </Button>
                  </div>
                  <div className="flex h-full items-center"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <YourClasses className={"mt-5"} />
    </div>
  );
}

export default KLearning;
