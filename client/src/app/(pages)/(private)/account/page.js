"use client";

import CustomSnackBar from "@/app/components/CustomSnackBar";
import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";
import { login } from "@/lib/redux/action/user";
import {
  AutoModeOutlined,
  ContactPhoneOutlined,
  EmailOutlined,
  Grid3x3Outlined,
  KeyOutlined,
  PersonOutline,
  UploadOutlined,
} from "@mui/icons-material";
import { Button, Skeleton, Switch, TextField } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Account() {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [isSettingsFormBtnSpinning, setIsSettingsFormBtnSpinning] =
    useState(false);
  const [snackBarData, setSnackBarData] = useState({
    content: "",
    severity: "",
    open: false,
  });

  const [settingsData, setSettingsData] = useState({
    username: {
      inputType: "text",
      label: "Tên người dùng",
      labelIcon: <PersonOutline className="text-sky-600" />,
      placeholder: "",
      disabled: true,
      error: "",
      value: user.username,
      settingType: "normal",
    },
    email: {
      inputType: "text",
      label: "Email",
      labelIcon: <EmailOutlined className="text-sky-600" />,
      placeholder: "Nhập email mới...",
      disabled: false,
      error: "",
      value: "",
      settingType: "normal",
    },
    phoneNumber: {
      inputType: "text",
      label: "Số điện thoại",
      labelIcon: <ContactPhoneOutlined className="text-sky-600" />,
      placeholder: "Nhập số điện thoại mới...",
      disabled: false,
      error: "",
      value: "",
      settingType: "normal",
    },
    userId: {
      inputType: "text",
      label: "Mã định danh người dùng",
      labelIcon: <Grid3x3Outlined className="text-red-600" />,
      placeholder: "",
      disabled: true,
      error: "",
      value: user._id,
      settingType: "advanced",
    },
    password: {
      inputType: "password",
      label: "Mật khẩu",
      labelIcon: <KeyOutlined className="text-red-600" />,
      placeholder: "Nhập mật khẩu cũ...",
      disabled: true,
      error: "",
      value: "********",
      settingType: "security",
    },
    newPassword: {
      inputType: "password",
      label: "Mật khẩu mới",
      labelIcon: <KeyOutlined className="text-red-600" />,
      placeholder: "Nhập mật khẩu mới...",
      disabled: false,
      error: "",
      value: "",
      settingType: "security",
      hidden: true,
    },
    reNewPassword: {
      inputType: "password",
      label: "Nhập lại mật khẩu mới",
      labelIcon: <KeyOutlined className="text-red-600" />,
      placeholder: "Nhập lại mật khẩu mới...",
      disabled: false,
      error: "",
      value: "",
      settingType: "security",
      hidden: true,
    },
  });

  const [isSecuritySettingEnabled, setIsSecuritySettingEnabled] =
    useState(false);

  const handleEditSettingsForm = (settingKey, field, value) => {
    setSettingsData((prev) => ({
      ...prev,
      [settingKey]: { ...prev[settingKey], [field]: value },
    }));
  };

  // switch : normal settings and advanced, security settings
  const handleSwitchSettings = () => {
    if (!isSecuritySettingEnabled) {
      handleEditSettingsForm("email", "disabled", true);
      handleEditSettingsForm("phoneNumber", "disabled", true);
      handleEditSettingsForm("password", "value", "");
      handleEditSettingsForm("password", "disabled", false);
      handleEditSettingsForm("password", "label", "Mật khẩu hiện tại");
      handleEditSettingsForm("newPassword", "hidden", false);
      handleEditSettingsForm("reNewPassword", "hidden", false);
    } else {
      handleEditSettingsForm("email", "disabled", false);
      handleEditSettingsForm("phoneNumber", "disabled", false);
      handleEditSettingsForm("reNewPassword", "hidden", true);
      handleEditSettingsForm("password", "disabled", true);
      handleEditSettingsForm("password", "value", "********");
      handleEditSettingsForm("password", "label", "Mật khẩu");
      handleEditSettingsForm("newPassword", "hidden", true);
      handleEditSettingsForm("newPassword", "value", "");
      handleEditSettingsForm("reNewPassword", "value", "");
      handleEditSettingsForm("password", "error", "");
      handleEditSettingsForm("newPassword", "error", "");
      handleEditSettingsForm("reNewPassword", "error", "");
    }

    setIsSecuritySettingEnabled((prev) => !prev);
  };

  const handleChangePassword = () => {
    if (!isSecurityFormValid()) return;

    setIsSettingsFormBtnSpinning(true);

    const changePasswordDTO = {
      username: user.username,
      currentPassword: settingsData.password.value,
      newPassword: settingsData.newPassword.value,
    };

    const api = `/users/change-password`;
    instance
      .patch(api, changePasswordDTO, getApiConfig())
      .then(() => {
        setSnackBarData((prev) => ({
          ...prev,
          content: "Thay đổi mật khẩu thành công",
          open: true,
          severity: "success",
        }));
        handleSwitchSettings();
      })
      .catch(() => {
        setSnackBarData((prev) => ({
          ...prev,
          content: "Bạn đã nhập sai mật khẩu cũ",
          open: true,
          severity: "error",
        }));
        handleEditSettingsForm(
          "password",
          "error",
          "Bạn đã nhập sai mật khẩu cũ"
        );
      })
      .finally(() => {
        setIsSettingsFormBtnSpinning(false);
      });
  };

  const isAnyNormalFieldChanged = () => {
    const key = Object.keys(settingsData).find((settingKey) => {
      const setting = settingsData[settingKey];
      return (
        setting.settingType === "normal" &&
        !setting.disabled &&
        setting.value !== user[settingKey]
      );
    });
    return !!key;
  };

  const handleUpdateUserData = () => {
    if (!isNormalFormValid()) return;
    if (!isAnyNormalFieldChanged()) {
      setSnackBarData({
        content: "Không có thông tin được cập nhật",
        severity: "warning",
        open: true,
      });
      return;
    }

    setIsSettingsFormBtnSpinning(true);

    const newUser = {
      ...user,
      email: settingsData.email.value,
      phoneNumber: settingsData.phoneNumber.value,
    };

    const api = `users/update-profile`;
    instance
      .patch(api, newUser, getApiConfig())
      .then(() => {
        dispatch(login(newUser));
        setSnackBarData({
          content: "Cập nhật thông tin người dùng thành công",
          open: true,
          severity: "success",
        });
      })
      .catch(() => {
        setSnackBarData({
          content: "Cập nhật thông tin người dùng thất bại",
          open: true,
          severity: "error",
        });
      })
      .finally(() => {
        setIsSettingsFormBtnSpinning(false);
      });
  };

  // form validation
  const isFieldValid = (field, value) => {
    if (!String(value).trim()) return "Trường này là bắt buộc";
    switch (field) {
      case "email":
        return String(value)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
          ? ""
          : "Email không hợp lệ";
      case "phoneNumber":
        return String(value).match(
          /^[(]?[0-9]{3}[)]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
        )
          ? ""
          : "Số điện thoại không hợp lệ";
      case "password":
        return value.length >= 6 ? "" : "Mật khẩu phải dài tối thiểu 6 ký tự";
      case "newPassword":
        return value == settingsData.password.value
          ? "Mật khẩu mới phải khác mật khẩu cũ"
          : value.length >= 6
          ? ""
          : "Mật khẩu phải dài tối thiểu 6 ký tự";
      case "reNewPassword":
        return value.length < 6
          ? "Mật khẩu phải dài tối thiểu 6 ký tự"
          : value == settingsData.newPassword.value
          ? ""
          : "Mật khẩu không khớp";
      default:
        return "";
    }
  };

  // settings form behavior
  const handleBlurField = (field, value) => {
    const error = isFieldValid(field, value);
    error && handleEditSettingsForm(field, "error", error);
  };

  const handleFocusField = (field) => {
    handleEditSettingsForm(field, "error", "");
  };

  const isSecurityFormValid = () => {
    let isValid = true;

    Object.keys(settingsData).map((field) => {
      if (settingsData[field].settingType !== "security") return;
      const error = isFieldValid(field, settingsData[field].value);

      if (error) {
        handleEditSettingsForm(field, "error", error);
        isValid = false;
      }
    });

    return isValid;
  };

  const isNormalFormValid = () => {
    let isValid = true;

    Object.keys(settingsData).map((field) => {
      if (settingsData[field].settingType !== "normal") return;
      const error = isFieldValid(field, settingsData[field].value);

      if (error) {
        handleEditSettingsForm(field, "error", error);
        isValid = false;
      }
    });

    return isValid;
  };

  // profile image

  const [isSubmitProfileImageBtnSpinning, setIsSubmitProfileImageBtnSpinning] =
    useState(false);

  const [profileImage, setProfileImage] = useState(null);

  const [previewProfileImagePath, setPreviewProfileImagePath] = useState("");

  const handleUpdateProfileImage = (image) => {
    setIsSubmitProfileImageBtnSpinning(true);

    const formData = new FormData();
    formData.append("file", image);

    const api = `/users/${user._id}/upload-profile-image`;
    instance
      .post(api, formData, getApiConfig())
      .then((res) => {
        const newUser = res.data;
        dispatch(login(newUser));
        setPreviewProfileImagePath("");
        setSnackBarData({
          content: "Cập nhật ảnh đại diện thành công",
          severity: "success",
          open: true,
        });
      })
      .catch(() => {
        setSnackBarData({
          content: "Cập nhật ảnh đại diện thất bại",
          severity: "error",
          open: true,
        });
      })
      .finally(() => {
        setIsSubmitProfileImageBtnSpinning(false);
      });
  };

  const handlePreviewProfileImage = (image) => {
    if (!image) return;
    const reader = new FileReader();

    reader.onload = (e) => {
      setPreviewProfileImagePath(e.target.result);
    };

    reader.readAsDataURL(image);
  };

  useEffect(() => {
    if (Object.keys(user).length == 0) return;
    handleEditSettingsForm("username", "value", user.username);
    handleEditSettingsForm("email", "value", user.email);
    handleEditSettingsForm("phoneNumber", "value", user.phoneNumber);
    handleEditSettingsForm("userId", "value", user._id);
  }, [user]);

  return (
    <Fragment>
      {Object.keys(user).length > 0 ? (
        <div className="bg-slate-100 rounded-lg border-2 border-sky-300 min-h-full flex flex-col p-2 sm:pt-7 sm:pl-20 sm:pr-20 md:pl-0 md:pr-0 md:justify-center md:flex-row">
          {/* SnackBar */}
          <CustomSnackBar
            content={snackBarData.content}
            severity={snackBarData.severity}
            open={snackBarData.open}
            onCLose={() => {
              setSnackBarData((prev) => ({ ...prev, open: false }));
            }}
          />

          {/* normal settings */}
          <div className="border-2 border-sky-400 rounded-lg bg-white flex flex-col items-center">
            <header className="pb-5 pt-5 font-semibold text-lg">
              Thông tin tài khoản
            </header>
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center">
                <div className="border-2 border-sky-600 mb-5 w-28 h-28 rounded-full overflow-hidden">
                  <img
                    src={
                      previewProfileImagePath
                        ? previewProfileImagePath
                        : user.profileImage
                        ? user.profileImage
                        : "assets/images/profile_image.png"
                    }
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="pb-5">
                  {previewProfileImagePath && (
                    <div className="italic font-semibold text-sm text-slate-400 mb-5">
                      Ảnh ở chế độ xem trước
                    </div>
                  )}
                  <label
                    htmlFor="profile_input"
                    className="p-2 rounded-md cursor-pointer border-2 border-slate-200 font-semibold text-slate-500"
                  >
                    <UploadOutlined className="text-sky-400" />
                    Thay ảnh đại diện
                  </label>
                  <input
                    id="profile_input"
                    className="hidden"
                    type="file"
                    multiple={false}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setProfileImage(file);
                      handlePreviewProfileImage(file);
                    }}
                    accept="image/jpeg,image/png"
                  />
                </div>
                {previewProfileImagePath && (
                  <div className="flex items-center justify-between pb-3">
                    <Button
                      color="error"
                      variant="outlined"
                      // disabled={!previewProfileImagePath}
                      onClick={() => {
                        setPreviewProfileImagePath("");
                        setProfileImage(null);
                      }}
                    >
                      Hủy
                    </Button>
                    <Button
                      color="success"
                      variant="outlined"
                      className="ml-3"
                      style={{ minWidth: "115px" }}
                      // disabled={!profileImage || !previewProfileImagePath}
                      onClick={() => {
                        profileImage &&
                          previewProfileImagePath &&
                          handleUpdateProfileImage(profileImage);
                      }}
                    >
                      {isSubmitProfileImageBtnSpinning ? (
                        <AutoModeOutlined className="animate-spin" />
                      ) : (
                        "Lưu thay đổi"
                      )}
                    </Button>
                  </div>
                )}
              </div>
              <div className="border-t-2 border-t-slate-200 p-5 md:pl-10 md:pr-10 lg:pl-20 lg:pr-20">
                {Object.keys(settingsData).map((settingKey, index) => {
                  const setting = settingsData[settingKey];
                  return (
                    setting.settingType === "normal" &&
                    !setting.hidden && (
                      <div
                        key={`normal_setting_${index}`}
                        className="flex items-start flex-col mt-6"
                      >
                        <label className="font-semibold text-slate-600 mb-2">
                          {setting.labelIcon} {setting.label}
                        </label>
                        <TextField
                          disabled={setting.disabled}
                          error={!!setting.error}
                          helperText={setting.error}
                          value={setting.value}
                          placeholder={setting.placeholder}
                          onChange={(e) =>
                            handleEditSettingsForm(
                              settingKey,
                              "value",
                              e.target.value
                            )
                          }
                          onFocus={() => {
                            handleFocusField(settingKey);
                          }}
                          onBlur={() => {
                            handleBlurField(settingKey, setting.value);
                          }}
                        />
                      </div>
                    )
                  );
                })}
              </div>
            </div>
          </div>
          {/* advanced and security settings */}
          <div className="border-2 border-sky-400 rounded-lg bg-white mt-5 flex flex-col items-center md:mt-0 md:ml-3 lg:ml-24">
            <header className="p-5 font-semibold text-lg flex justify-center items-center sm:pl-20 sm:pr-20 ">
              Bảo mật và Nâng cao
            </header>
            <form className="border-t-2 border-t-slate-200 p-5 md:p-0 lg:pl-20 lg:pr-20">
              {Object.keys(settingsData).map((settingKey, index) => {
                const setting = settingsData[settingKey];
                return (
                  (setting.settingType === "advanced" ||
                    setting.settingType === "security") &&
                  !setting.hidden && (
                    <div
                      key={`ad_security_setting_${index}`}
                      className="flex items-start flex-col mt-6"
                    >
                      <label className="font-semibold text-slate-600 mb-2">
                        {setting.labelIcon} {setting.label}
                      </label>
                      <TextField
                        disabled={setting.disabled}
                        error={!!setting.error}
                        helperText={setting.error}
                        value={setting.value}
                        placeholder={setting.placeholder}
                        type={setting.inputType}
                        onChange={(e) =>
                          handleEditSettingsForm(
                            settingKey,
                            "value",
                            e.target.value
                          )
                        }
                        onFocus={() => {
                          handleFocusField(settingKey);
                        }}
                        onBlur={() => {
                          handleBlurField(settingKey, setting.value);
                        }}
                      />
                    </div>
                  )
                );
              })}
            </form>

            <div className="flex justify-end items-center">
              <label className="font-semibold text-slate-600 mr-2">
                Đổi mật khẩu
              </label>
              <Switch
                color="warning"
                onChange={() => {
                  handleSwitchSettings();
                }}
                checked={isSecuritySettingEnabled}
              />
            </div>
            <div className="flex justify-center pt-5 pb-6 mt-3 w-full border-t-2 border-t-slate-200">
              {/* <Button color="error" variant="outlined" disabled>
            Hủy
          </Button> */}
              <Button
                color="success"
                variant="outlined"
                className="ml-3"
                style={{ minWidth: "128px" }}
                disabled={false}
                onClick={
                  isSettingsFormBtnSpinning
                    ? null
                    : isSecuritySettingEnabled
                    ? handleChangePassword
                    : handleUpdateUserData
                }
              >
                {isSettingsFormBtnSpinning ? (
                  <AutoModeOutlined className="text-sky-500 animate-spin" />
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <Skeleton width={200} height={70}></Skeleton>
          <Skeleton variant="circular" width={100} height={100}></Skeleton>
          <Skeleton width={200} height={70}></Skeleton>
          <Skeleton width={200} height={70}></Skeleton>
          <Skeleton width={200} height={70}></Skeleton>
          <Skeleton width={200} height={70}></Skeleton>
        </div>
      )}
    </Fragment>
  );
}

export default Account;
