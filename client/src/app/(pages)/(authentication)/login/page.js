"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  AccountCircle,
  CachedOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { instance } from "@/app/utils/axios";

import Link from "next/link";
import { useRouter } from "next/navigation";

function Login() {
  const router = useRouter();

  const [loginBtnStt, setLoginBtnStt] = useState({
    isDisabled: false,
    isSpinning: false,
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleTogglePasswordVisible = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const [formData, setFormData] = useState({
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

  const handleLogin = async () => {
    const isValid = handleValidateForm();

    if (!isValid) return;

    setLoginBtnStt((prev) => ({
      ...prev,
      isSpinning: true,
    }));

    const user = {
      username: formData.username.value,
      password: formData.password.value,
    };

    instance
      .post("/auth/login", user)
      .then((res) => {
        const jwtToken = res.data.token;
        localStorage.setItem("jwtToken", jwtToken);
        localStorage.setItem("username", user.username);
        router.push("/file-explore/home");
      })
      .catch(() => {
        setFormData((prev) => ({
          ...prev,
          username: {
            ...prev["username"],
            helperText: "Tài khoản hoặc mật khẩu không chính xác",
          },
          password: {
            ...prev["password"],
            helperText: "Tài khoản hoặc mật khẩu không chính xác",
          },
        }));
        setLoginBtnStt((prev) => ({ ...prev, isSpinning: false }));
      });
  };

  return (
    <div className="w-full h-full bg-slate-100 bg-cover flex justify-center items-center">
      <div className="p-10 flex justify-center items-center">
        <div className="border-sky-300 border-2 flex-1 rounded-2xl p-7 bg-white text-center">
          <div className="w-full p-5 text-3xl font-bold text-slate-700 border-b-2 border-slate-200 font-mono">
            Đăng nhập
          </div>
          <div className="mb-4 w-full p-2 flex justify-center items-center ">
            <img className="w-20 h-20" src={"/assets/images/logo.png"} />
            <h1 className="font-semibold text-2xl font-mono p-2">K-Editor</h1>
          </div>

          <form className="w-full flex flex-col justify-center items-center">
            <Grid container spacing={2} className="w-6/12">
              {Object.keys(formData).map((field) => {
                console.log(
                  formData[field].type !== "password"
                    ? "text"
                    : isPasswordVisible
                    ? "text"
                    : "password"
                );
                return (
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
                        e.key == "Enter" && handleLogin();
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </form>
          <div className="mt-1">
            <Box marginBottom={1}>
              <Checkbox id="remember" />
              <label htmlFor="remember" className="select-none cursor-pointer">
                Nhớ mật khẩu
              </label>
            </Box>
            <Button
              variant="outlined"
              onClick={() => {
                handleLogin();
              }}
              style={{ minWidth: "115px" }}
              disabled={loginBtnStt.isDisabled}
            >
              {loginBtnStt.isSpinning ? (
                <CachedOutlined className="animate-spin" />
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </div>
          <Link
            href={"/register"}
            className="block mt-2 hover:underline duration-300 text-slate-900"
          >
            <Button color="inherit">Chưa có tài khoản? Đăng ký ngay</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
