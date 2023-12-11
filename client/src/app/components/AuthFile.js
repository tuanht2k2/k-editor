"use client";

import { useState } from "react";

import {
  CachedOutlined,
  FileOpenOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";

function AuthFile({
  fileId,
  passwordValue,
  handleTypingPassword,
  isBtnSpinning,
  handleAccessFile,
  error,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center rounded-lg">
      <div className="bg-white p-5 rounded-xl border-2 border-sky-300">
        <div className="flex items-center flex-col">
          <div className="flex items-center">
            <div className="font-semibold text-lg text-slate-500 flex flex-col items-center">
              <div className="flex items-center">
                Truy cập vào tài liệu
                <FileOpenOutlined className="text-sky-500" />
              </div>
              <span className="text-sm text-slate-400 font-normal italic">
                (Bỏ qua nếu tài liệu được công khai)
              </span>
            </div>
          </div>
          <span className="font-semibold text-sm mt-2">{fileId}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="mt-5 mb-2">
            <TextField
              placeholder="Nhập mật khẩu tài liệu"
              type={isPasswordVisible ? "text" : "password"}
              InputProps={{
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
                handleTypingPassword(e.target.value);
              }}
              value={passwordValue}
              error={!!error.trim()}
              helperText={error}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  handleAccessFile();
                }
              }}
            />
          </div>
          <Button
            onClick={handleAccessFile}
            variant="outlined"
            color={passwordValue.trim() ? "info" : "warning"}
            style={{ minWidth: "115px" }}
          >
            {isBtnSpinning ? (
              <CachedOutlined className="animate-spin" />
            ) : passwordValue.trim() ? (
              "Truy cập với mật khẩu"
            ) : (
              "Bỏ qua"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AuthFile;
