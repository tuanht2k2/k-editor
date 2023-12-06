"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";

function SignIn() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const [formData, setFormData] = useState({
    email: {
      label: (
        <div className="text-sky-600">
          <FontAwesomeIcon className="mr-2" icon={faUser} /> Email
        </div>
      ),
      helperText: "",
      value: "",
      type: "text",
    },
    password: {
      label: (
        <div className="text-sky-600">
          <FontAwesomeIcon className="mr-2" icon={faLock} /> Mật khẩu
        </div>
      ),
      helperText: "",
      value: "",
      type: "password",
    },
    rePassword: {
      label: (
        <div className="text-sky-600">
          <FontAwesomeIcon className="mr-2" icon={faLock} /> Nhập lại mật khẩu
        </div>
      ),
      helperText: "",
      value: "",
      type: "password",
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

  const handleSubmitSignUp = async () => {
    const isValid = handleValidateForm();

    if (isValid) {
      const user = await handleSignIn(
        formData.email.value,
        formData.password.value
      );
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      navigate("/", { replace: true });
    }

    return () => {};
  }, [isSignedIn]);

  return (
    <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-600 bg-cover flex justify-center items-center">
      <div className="p-10 flex justify-center items-center">
        <div className="flex-1 rounded-2xl p-7 bg-cyan-50 text-center shadow-sm shadow-slate-400">
          <div className="w-full flex justify-center items-center">
            <img className="w-20 h-20" src={"/assets/images/logo.png"} />
          </div>
          <div className="w-full p-5 text-2xl font-bold text-slate-700">
            Tạo tài khoản
          </div>
          <form className="w-full flex flex-col justify-center items-center">
            <Grid container spacing={1} className="w-6/12">
              {Object.keys(formData).map((field) => (
                <Grid key={`sign-in-form-${field}`} item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label={formData[field].label}
                    type={formData[field].type}
                    helperText={formData[field].helperText}
                    error={formData[field].helperText ? true : false}
                    autoComplete={false}
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
                  />
                </Grid>
              ))}
            </Grid>
          </form>
          <div className="mt-1">
            <Box marginBottom={1}>
              <Checkbox
                id="acceptLicense"
                defaultChecked
                disabled
                className="cursor-pointer"
              />
              <label className="select-none">
                Đăng ký đồng nghĩ với việc bạn đồng ý với điều khoản và dịch vụ
                của chúng tôi
              </label>
            </Box>
            <Button
              variant="outlined"
              onClick={() => {
                handleSubmitSignUp();
              }}
            >
              Đăng ký
            </Button>
          </div>
          <Link
            href={"/sign-in"}
            className="block mt-2 hover:underline duration-300 text-slate-900"
          >
            <Button color="inherit">Đã có tài khoản?</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
