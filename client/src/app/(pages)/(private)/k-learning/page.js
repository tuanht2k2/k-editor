"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  AbcOutlined,
  InputOutlined,
  PinOutlined,
  SchoolOutlined,
} from "@mui/icons-material";

import {
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";

import CustomSnackBar from "@/app/components/CustomSnackBar";
import YourClasses from "@/app/components/KLearning/YourClasses";

import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";
import CustomCircularProgress from "@/app/components/CustomCircularProgress";
import JoinedClasses from "@/app/components/KLearning/JoinedClasses";

function KLearning() {
  const user = useSelector((state) => state.user);

  const [accessClassFormData, setAccessClassFormData] = useState({
    idValue: "",
    isBtnSpinning: false,
  });

  const [createClassFormData, setCreateClassFormData] = useState({
    classnameValue: "",
    passwordValue: "",
    isBtnSpinning: false,
  });

  const [classes, setClasses] = useState("loading");

  // create class
  const handleCreateClass = () => {
    if (Object.keys(user).length == 0) return;

    setCreateClassFormData((prev) => ({ ...prev, isBtnSpinning: true }));
    const api = `classes/create`;

    const newClass = {
      classname: createClassFormData.classnameValue,
      ownerId: user._id,
    };

    instance
      .post(api, newClass, getApiConfig())
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
      .then(() => {
        handleGetYourClasses();
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

  const handleJoinClass = () => {
    setAccessClassFormData((prev) => ({ ...prev, isBtnSpinning: true }));

    const api = `classes/join`;
    const data = {
      classId: accessClassFormData.idValue,
      userId: user._id,
      status: "JOIN",
    };
    instance
      .post(api, data, getApiConfig())
      .then(() => {
        setAccessClassFormData((prev) => ({ ...prev, idValue: "" }));
        setSnackBarData({
          content: "Yêu cầu tham gia lớp học thành công",
          severity: "success",
          open: true,
        });
      })
      .catch(() => {
        setSnackBarData({
          content: "Đã xảy ra lỗi",
          severity: "error",
          open: true,
        });
      })
      .finally(() => {
        setAccessClassFormData((prev) => ({ ...prev, isBtnSpinning: false }));
      });
  };

  const handleGetYourClasses = () => {
    const api = `classes/user=${user._id}/all-classes`;
    instance
      .get(api, getApiConfig())
      .then((res) => {
        setClasses(res.data);
      })
      .catch(() => {});
  };

  // snackbar
  const [snackBarData, setSnackBarData] = useState({
    content: "",
    open: false,
    severity: "",
  });

  useEffect(() => {
    if (Object.keys(user).length == 0) return;
    handleGetYourClasses();
  }, []);

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
        <div className="font-semibold text-xl rounded-lg flex items-center text-sky-600">
          K-Learning <SchoolOutlined className="text-sky-500 ml-2" />
        </div>
      </header>
      <div className="mt-4">
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
                  error={!accessClassFormData.idValue.trim()}
                  onChange={(e) => {
                    setAccessClassFormData((prev) => ({
                      ...prev,
                      idValue: e.target.value,
                    }));
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PinOutlined className="text-sky-500" />
                      </InputAdornment>
                    ),
                  }}
                  onKeyDown={(e) => {
                    if (!accessClassFormData.idValue.trim()) return;
                    e.key == "Enter" && handleJoinClass();
                  }}
                />
                <div className="flex items-center mt-3">
                  <div className="mr-3">
                    <Button
                      variant="outlined"
                      style={{ minWidth: "115px" }}
                      disabled={!accessClassFormData.idValue.trim()}
                      onClick={handleJoinClass}
                    >
                      {accessClassFormData.isBtnSpinning ? (
                        <CircularProgress size={20} />
                      ) : (
                        "Tham gia"
                      )}
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
                Tạo lớp học mới
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
                        <CircularProgress size={20} className="animate-spin" />
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

      <div className="mt-5">
        <div className="font-semibold text-gray-800">
          Lớp học bạn đã tham gia
        </div>
        {classes == "loading" ? (
          <div className="pt-8 pb-8">
            <CustomCircularProgress />
          </div>
        ) : (
          <JoinedClasses
            joinedClasses={classes.joinedClasses}
            className={"mt-1"}
          />
        )}
      </div>

      <div className="mt-8">
        <div className="font-semibold text-gray-800">Lớp học bạn sở hữu</div>
        {classes == "loading" ? (
          <div className="pt-8 pb-8">
            <CustomCircularProgress />
          </div>
        ) : (
          <YourClasses yourClasses={classes.yourClasses} className={"mt-1"} />
        )}
      </div>
    </div>
  );
}

export default KLearning;
