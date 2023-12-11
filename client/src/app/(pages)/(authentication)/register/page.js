"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import {
  AccountCircle,
  CachedOutlined,
  EmailOutlined,
  LockOutlined,
  PhoneOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { instance } from "@/app/utils/axios";
import { useDispatch, useSelector } from "react-redux";
import CustomSnackBar from "@/app/components/CustomSnackBar";

function Register() {
  const user = useSelector((state) => state.user);

  // snackbar
  const [snackBarData, setSnackBarData] = useState({
    content: "",
    open: "false",
    severity: "",
  });

  const [registerBtnStt, setRegisterBtn] = useState({
    isDisabled: false,
    isSpinning: false,
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleTogglePasswordVisible = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const [formData, setFormData] = useState({
    email: {
      helperText: "",
      value: "",
      type: "text",
      placeholder: "Nhập email...",
      inputProps: {
        startAdornment: (
          <InputAdornment position="start">
            <EmailOutlined className="text-sky-500" />
          </InputAdornment>
        ),
      },
    },
    username: {
      helperText: "",
      value: "",
      type: "text",
      placeholder: "Nhập tên tài khoản...",
      inputProps: {
        startAdornment: (
          <InputAdornment position="start">
            <AccountCircle className="text-sky-500" />
          </InputAdornment>
        ),
      },
    },
    phoneNumber: {
      helperText: "",
      value: "",
      type: "text",
      placeholder: "Nhập số điện thoại...",
      inputProps: {
        startAdornment: (
          <InputAdornment position="start">
            <PhoneOutlined className="text-sky-500" />
          </InputAdornment>
        ),
      },
    },
    password: {
      helperText: "",
      value: "",
      type: "password",
      placeholder: "Nhập mật khẩu...",
      inputProps: {
        startAdornment: (
          <InputAdornment position="start">
            <LockOutlined className="text-sky-600" />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="start">
            <IconButton onClick={handleTogglePasswordVisible}>
              {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      },
    },
    rePassword: {
      helperText: "",
      value: "",
      type: "password",
      placeholder: "Nhập mật khẩu mới...",
      inputProps: {
        startAdornment: (
          <InputAdornment position="start">
            <LockOutlined className="text-sky-600" />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="start">
            <IconButton onClick={handleTogglePasswordVisible}>
              {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      },
    },
  });

  const handleSetFormData = (field, type, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [type]: value },
    }));
  };

  const handleType = (field, value) => {
    handleSetFormData(field, "value", value);
  };

  //handle validation

  const handleValidateInput = (inputName, value) => {
    if (!String(value).trim()) return "Trường này là bắt buộc";
    switch (inputName) {
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
      case "rePassword":
        return value.length < 6
          ? "Mật khẩu phải dài tối thiểu 6 ký tự"
          : value == formData.password.value
          ? ""
          : "Mật khẩu không khớp";
      default:
        return "";
    }
  };

  const handleValidateForm = () => {
    let isValid = true;

    Object.keys(formData).map((field) => {
      const helperText = handleValidateInput(field, formData[field].value);

      if (helperText) {
        handleSetFormData(field, "helperText", helperText);
        isValid = false;
      }
    });

    return isValid;
  };

  const handleBlurInput = (fieldName, value) => {
    const helperText = handleValidateInput(fieldName, value);
    helperText && handleSetFormData(fieldName, "helperText", helperText);
  };

  const handleFocusInput = (fieldName) => {
    handleSetFormData(fieldName, "helperText", "");
  };

  const handleRegister = () => {
    const isValid = handleValidateForm();

    if (!isValid) return;

    setRegisterBtn((prev) => ({
      ...prev,
      isSpinning: true,
    }));

    const user = {
      email: formData.email.value,
      username: formData.username.value,
      phoneNumber: formData.phoneNumber.value,
      password: formData.password.value,
    };

    instance
      .post("/auth/register", user)
      .then(() => {
        setSnackBarData(() => ({
          content: "Tạo tài khoản thành công",
          severity: "success",
          open: true,
        }));
      })
      .catch((err) => {
        const errMsg = err.response.data;
        handleSetFormData(
          errMsg === "usernameExisted"
            ? "username"
            : errMsg === "phoneNumberExisted"
            ? "phoneNumber"
            : "email",
          "helperText",
          errMsg === "usernameExisted"
            ? "Tên tài khoản đã tồn tại"
            : errMsg === "phoneNumberExisted"
            ? "Số điện thoại đã tồn tại"
            : "Email đã tồn tại"
        );
        setSnackBarData(() => ({
          content: "Tạo tài khoản thất bại",
          severity: "error",
          open: true,
        }));
      })
      .finally(() => {
        setRegisterBtn((prev) => ({ ...prev, isSpinning: false }));
      });
  };

  return (
    <div className="min-h-full min-w-full bg-slate-100 bg-cover flex justify-center items-center">
      <CustomSnackBar
        content={snackBarData.content}
        severity={snackBarData.severity}
        open={snackBarData.open}
        onCLose={() => {
          setSnackBarData((prev) => ({ ...prev, open: false }));
        }}
      />

      <div className="flex justify-center items-center pl-32 pr-32 sm:pl-10 sm:pr-10">
        <div className="border-sky-300 border-2 flex-1 rounded-2xl p-2 bg-white text-center">
          <div className="w-full p-5 text-3xl font-bold text-slate-700 border-b-2 border-slate-200 font-mono">
            Tạo tài khoản
          </div>
          <div className="mb-4 w-full p-2 flex justify-center items-center ">
            <img className="w-20 h-20" src={"/assets/images/logo.png"} />
            <h1 className="font-semibold text-2xl font-mono p-2">K-Editor</h1>
          </div>

          <form className="w-full flex flex-col justify-center items-center">
            <Grid
              container
              spacing={2}
              className="lg:w-4/12 md:w-6/12 sm:w-6/12"
            >
              {Object.keys(formData).map((field) => (
                <Grid key={`log-in-form-${field}`} item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder={formData[field].placeholder}
                    InputProps={formData[field].inputProps}
                    type={
                      formData[field].type !== "password"
                        ? "text"
                        : isPasswordVisible
                        ? "text"
                        : "password"
                    }
                    helperText={formData[field].helperText}
                    error={formData[field].helperText ? true : false}
                    value={formData[field].value}
                    onFocus={() => {
                      handleFocusInput(field);
                    }}
                    onChange={(e) => {
                      handleType(field, e.target.value);
                    }}
                    onBlur={(e) => {
                      handleBlurInput(field, e.target.value);
                    }}
                    onKeyDown={(e) => {
                      e.key == "Enter" && handleRegister();
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </form>
          <div className="mt-1">
            <Button
              variant="outlined"
              onClick={() => {
                handleRegister();
              }}
              style={{ minWidth: "115px", marginTop: "10px" }}
              disabled={registerBtnStt.isDisabled}
            >
              {registerBtnStt.isSpinning ? (
                <CachedOutlined className="animate-spin" />
              ) : (
                "Đăng ký"
              )}
            </Button>
          </div>
          <Link
            href={"/login"}
            className="block mt-2 hover:underline duration-300 text-slate-900"
          >
            <Button color="inherit">Đã có tài khoản?</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
