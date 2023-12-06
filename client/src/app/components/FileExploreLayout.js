"use client";

import {
  CachedOutlined,
  FolderOpenOutlined,
  JoinFullOutlined,
  NoteAddOutlined,
} from "@mui/icons-material";
import { Button, TextField } from "@mui/material";

import FileExplore from "@/app/components/FileExplore";
import Custom404 from "@/app/components/Custom404";

import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";

import { Fragment } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const files = {
  // type: "spreadsheet",
  data: [
    {
      id: "1",
      name: "file 1",
      lastModified: new Date(),
      ownerName: "Đinh Công Tuấn",
      size: "13.2Kb",
    },
    {
      id: "2",
      name: "file 2",
      lastModified: new Date(),
      ownerName: "Lê Quốc Mạnh",
      size: "1Mb",
    },
    {
      id: "3",
      name: "file 3",
      lastModified: new Date(),
      ownerName: "Trần Đức Dũng",
      size: "78Kb",
    },
  ],
};

function FileExploreLayout({ componentType }) {
  const user = useSelector((state) => state.user);

  const router = useRouter();

  const [isFileExploreLoaded, setIsFileExploreLoaded] = useState(false);

  const [fileExplore, setFileExplore] = useState({
    folders: null,
    files: null,
  });

  const [isAvailbleFolder, setIsAvailbleFolder] = useState(true);

  //checking current page: home or sub folder
  const currentPath = usePathname().split("/");
  const currentFolderId = currentPath[currentPath.length - 1];

  const [createFileFormData, setCreateFileFormData] = useState({
    value: "",
    isBtnSpinning: false,
  });

  const [accessFileFormData, setAccessFileFormData] = useState({
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
        handleGetFolderData();
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

  const handleAccessFile = () => {
    setAccessFileFormData((prev) => ({ ...prev, isBtnSpinning: true }));
    router.push(`/${componentType}/documents/${accessFileFormData.value}`);
  };

  const handleGetFolderData = () => {
    if (Object.keys(user).length <= 0) return;

    const config = getApiConfig();
    const folderId = currentFolderId == "home" ? "root" : currentFolderId;
    const api = `folders/userid=${user._id}&folderid=${folderId}&fileformat=${
      componentType == "k-word" ? "txt" : "xlsx"
    }`;

    instance
      .get(api, config)
      .then((res) => {
        if (res.status !== 200) {
          setIsAvailbleFolder(false);
          return;
        }
        setFileExplore(res.data);
        setIsFileExploreLoaded(true);
      })
      .catch((err) => {
        console.log(err);
        setIsAvailbleFolder(false);
      });
  };

  useEffect(() => {
    handleGetFolderData();
  }, [user]);

  return (
    <Fragment>
      {isAvailbleFolder ? (
        <div className="p-6">
          <div className="w-full flex">
            {/* create document */}
            <div className="border-slate-200 border-2 p-5 rounded-xl">
              <h1 className="font-bold flex items-center text-2xl">
                <span className="mr-2">Tạo tài liệu mới</span>
                <NoteAddOutlined color="primary" />
              </h1>
              <div className="p-3">
                <div className="font-semibold mt-2 ">
                  <span className="">
                    Đặt tên cho tài liệu của bạn( *Tài liệu được thêm vào thư
                    mục
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
                    error={!createFileFormData.value.trim()}
                  />
                  <Button
                    variant="outlined"
                    color="success"
                    className="ml-4"
                    style={{ minWidth: "115px" }}
                    disabled={!createFileFormData.value.trim()}
                    onClick={() => {
                      handleCreateFile(
                        user._id,
                        fileExplore.folders?.folder
                          ? fileExplore.folders.folder._id
                          : "root",
                        createFileFormData.value,
                        "txt"
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
              </div>
            </div>
            {/* access document */}
            <div className="ml-4 border-slate-200 border-2 p-5 rounded-xl">
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
                    error={!accessFileFormData.value.trim()}
                  />
                  <Button
                    variant="outlined"
                    color="success"
                    className="ml-4"
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
              </div>
            </div>
          </div>

          <FileExplore
            componentType={componentType}
            userId={user?._id}
            parentFolder={fileExplore.folders?.folder}
            folders={fileExplore.folders?.subFolders}
            files={fileExplore.files}
            isFileExploreLoaded={isFileExploreLoaded}
            handleGetFolderData={handleGetFolderData}
          />
        </div>
      ) : (
        <Custom404 />
      )}
    </Fragment>
  );
}

export default FileExploreLayout;
