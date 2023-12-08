import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  CachedOutlined,
  GridOn,
  JoinFullOutlined,
  TextSnippetOutlined,
} from "@mui/icons-material";
import { Button, TextField } from "@mui/material";

function AccessFile({ componentType }) {
  const router = useRouter();

  const [accessFileFormData, setAccessFileFormData] = useState({
    value: "",
    isBtnSpinning: false,
  });

  const handleAccessFile = () => {
    setAccessFileFormData((prev) => ({ ...prev, isBtnSpinning: true }));
    router.push(`/${componentType}/documents/${accessFileFormData.value}`);
  };

  return (
    <div className="border-slate-200 border-2 p-5 rounded-xl">
      <h1 className="font-bold flex items-center text-2xl">
        <span className="mr-2"> Truy cập vào tài liệu có sẵn</span>
        <JoinFullOutlined color="primary" />
      </h1>
      <div className="p-3">
        <div className="font-semibold mt-2">Nhập ID tài liệu</div>
        <div className="flex items-center mt-2">
          <TextField
            placeholder="Nhập ID tài liệu..."
            value={accessFileFormData.value}
            onChange={(e) => {
              setAccessFileFormData((prev) => ({
                ...prev,
                value: e.target.value,
              }));
            }}
            onKeyDown={(e) => {
              e.key == "Enter" && handleAccessFile();
            }}
            error={!accessFileFormData.value.trim()}
          />
          <div className="ml-3 mr-3">
            <Button
              variant="outlined"
              color={componentType == "k-word" ? "info" : "success"}
              style={{ minWidth: "115px" }}
              onClick={handleAccessFile}
              disabled={!accessFileFormData.value.trim()}
            >
              {accessFileFormData.isBtnSpinning ? (
                <CachedOutlined className="animate-spin" />
              ) : (
                "Truy cập"
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

export default AccessFile;
