"use client";

import {
  CachedOutlined,
  CreateNewFolderOutlined,
  DeleteOutline,
  DriveFolderUpload,
  EastOutlined,
  FileOpenOutlined,
  Folder,
  FolderDeleteOutlined,
  FolderOpenOutlined,
  GridOn,
  NoteAddOutlined,
  PostAddOutlined,
  TextSnippetOutlined,
  WestOutlined,
} from "@mui/icons-material";
import { Breadcrumbs, Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import { useState } from "react";
import { instance } from "../utils/axios";
import CustomSkeleton from "./CustomSkeleton";
import getApiConfig from "../utils/getApiConfig";
import { useRef } from "react";

function FileExplore({
  componentType,
  userId,
  parentFolder,
  folders,
  files,
  isFileExploreLoaded,
  handleGetFolderData,
}) {
  //data grid columns configuration
  //file
  const fileColumns = useRef([
    {
      field: "format",
      headerName: "Phân loại",
      renderCell: () => (
        <div>
          {componentType == "k-sheet" ? (
            <div className="flex items-center">
              <GridOn className="text-green-700" />
              <span className="ml-2 text-xs font-semibold text-green-700">
                Xlsx file
              </span>
            </div>
          ) : (
            <div className="flex items-center">
              <TextSnippetOutlined className="text-sky-600" />
              <span className="ml-2 text-xs font-semibold text-sky-600">
                Txt file
              </span>
            </div>
          )}
        </div>
      ),
      width: 150,
    },
    { field: "_id", headerName: "ID", width: 0, hide: true },
    {
      field: "name",
      headerName: "Tên",
      width: 150,
    },
    { field: "createdAt", headerName: "Sửa đổi cuối", width: 350 },
    {
      field: "ownerName",
      headerName: "Chủ sở hữu",
      width: 250,
      renderCell: (params) => {
        return (
          <div className="flex items-center">
            <img
              className="w-6 h-6 rounded-full object-cover"
              src={"/assets/images/profile_image.png"}
            />
            <span className="ml-2 text-sm font-semibold">{params.value}</span>
          </div>
        );
      },
    },
    {
      field: "open",
      headerName: "",
      width: 50,
      renderCell: (params) => (
        <Link href={`/${componentType}/documents/${params.id}`}>
          <div className="rounded-full p-2 hover:bg-slate-200 duration-150">
            <FileOpenOutlined
              className="text-sky-700"
              titleAccess="Mở tài liệu"
            />
          </div>
        </Link>
      ),
    },
    ,
    {
      field: "delete",
      headerName: "",
      width: 50,
      renderCell: () => (
        <div className="rounded-full p-2 hover:bg-slate-200 duration-150 cursor-pointer">
          <DeleteOutline className="text-red-500" titleAccess="Xóa tài liệu" />
        </div>
      ),
    },
  ]);

  //folder
  const folderColumns = useRef([
    {
      field: "format",
      headerName: "Phân loại",
      renderCell: () => (
        <div className="flex items-center">
          <Folder className="text-yellow-500" />
          <span className="ml-2 text-yellow-500 text-xs font-semibold">
            Thư mục
          </span>
        </div>
      ),
      width: 150,
    },
    {
      field: "_id",
      headerName: "ID",
      width: 0,
      hide: true,
    },
    {
      field: "name",
      headerName: "Tên",
      width: 300,
      editable: true,
    },
    { field: "createAt", headerName: "Ngày tạo", width: 300 },
    {
      field: "open",
      headerName: "",
      width: 50,
      renderCell: (params) => (
        <Link href={`/${componentType}/${params.id}`}>
          <div className="rounded-full p-2 hover:bg-slate-200 duration-150">
            <DriveFolderUpload
              className="text-sky-700"
              titleAccess="Mở thư mục"
            />
          </div>
        </Link>
      ),
    },
    ,
    {
      field: "delete",
      headerName: "",
      width: 50,
      renderCell: () => (
        <div className="rounded-full p-2 hover:bg-slate-200 duration-150 cursor-pointer">
          <FolderDeleteOutlined
            className="text-red-500"
            titleAccess="Xóa thư mục"
          />
        </div>
      ),
    },
  ]);

  const [createFolderFormData, setCreateFolderFormData] = useState({
    isVisble: false,
    value: "New folder",
    isSubmitBtnSpinning: false,
  });

  const getFolderRowId = (row) => row._id;
  const getFileRowId = (row) => row._id;

  // call api
  const handleCreateFolder = () => {
    const parentFolderId = !!parentFolder ? parentFolder._id : "root";

    setCreateFolderFormData((prev) => ({ ...prev, isSubmitBtnSpinning: true }));

    const newFolder = {
      ownerId: userId,
      name: createFolderFormData.value,
      parentId: parentFolderId,
    };

    // call api
    const config = getApiConfig();

    instance
      .post("/folders/create", newFolder, config)
      .then((res) => {
        setCreateFolderFormData((prev) => ({
          ...prev,
          isSubmitBtnSpinning: false,
          isVisble: false,
        }));

        handleGetFolderData();
      })
      .catch((err) =>
        setCreateFolderFormData((prev) => ({
          ...prev,
          isSubmitBtnSpinning: false,
        }))
      );
  };

  const handleRenameFolder = (dataGridParams, event) => {
    const folder = dataGridParams.row;
    const newName = event.target?.value;

    if (!newName) return;
    if (folder.name == newName || !newName.trim()) return;

    const config = getApiConfig();

    instance
      .patch(`folders/${folder?._id}/new-name=${newName}`, {}, config)
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  return (
    <div className="mt-5 border-slate-200 border-2 p-5 rounded-xl">
      <div className="flex justify-between items-center">
        <div className="flex item-center">
          <h1 className="font-bold flex items-center text-2xl ">
            <span className="mr-2 text-slate-600">
              Quản lí tài nguyên <FolderOpenOutlined />
            </span>
          </h1>
          {componentType !== "any" && (
            <span className="ml-4 flex items-center text-slate-400 text-sm">
              {`Lưu ý: Chỉ xem được những file định dạng ${
                componentType === "k-word" ? ".txt" : ".xlsx"
              }`}
            </span>
          )}
        </div>
        <div className="flex items-center">
          {parentFolder && (
            <Link
              href={`/${componentType}/${
                parentFolder?.parentId == "root"
                  ? "home"
                  : parentFolder?.parentId
              }`}
              title="Quay lại"
              className="mr-4 rounded-full p-1 hover:bg-slate-100"
            >
              <WestOutlined />
            </Link>
          )}
          <button
            className="rounded-full p-1 hover:bg-slate-100"
            title="Tạo thư mục"
            onClick={() => {
              setCreateFolderFormData((prev) => ({
                value: "New folder",
                isVisble: !prev.isVisble,
              }));
            }}
          >
            <CreateNewFolderOutlined />
          </button>
          <button
            className="ml-4 rounded-full p-1 hover:bg-slate-100"
            title="Làm mới"
            onClick={handleGetFolderData}
          >
            <CachedOutlined />
          </button>
        </div>
      </div>
      <Breadcrumbs
        maxItems={10}
        aria-label="breadcrumb"
        className="mt-2 p-2 bg-slate-100 rounded-lg"
      >
        <Link
          href={`/${componentType}/home`}
          color="inherit"
          className={`rounded-sm p-1 text-sm`}
        >
          Trang chủ
        </Link>
        {parentFolder && (
          <Link
            href={`/k-sheet/${parentFolder._id}`}
            color="red"
            className={`rounded-sm p-1 text-sm underline`}
          >
            {parentFolder.name}
          </Link>
        )}
      </Breadcrumbs>
      <div>
        <div className="pt-4">
          <h1 className="text-md font-semibold">Thư mục</h1>
          {createFolderFormData.isVisble && (
            <div className="pt-4 pb-4 border-slate-100 flex items-center">
              <TextField
                placeholder={"Nhập tên thư mục mới..."}
                value={createFolderFormData.value}
                onChange={(e) => {
                  setCreateFolderFormData((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }));
                }}
                error={!createFolderFormData.value.trim()}
                inputRef={(input) => input && input.focus()}
              />
              <Button
                variant="outlined"
                color="success"
                style={{ minWidth: "115px" }}
                className={`ml-2 ${
                  !createFolderFormData.value.trim()
                    ? `cursor-no-drop`
                    : `cursor-pointer`
                }`}
                disabled={!createFolderFormData.value.trim()}
                onClick={handleCreateFolder}
              >
                {createFolderFormData.isSubmitBtnSpinning ? (
                  <CachedOutlined className="animate-spin" />
                ) : (
                  "Xác nhận"
                )}
              </Button>
            </div>
          )}
          {isFileExploreLoaded ? (
            folders?.length > 0 ? (
              <DataGrid
                className="mt-1"
                columns={folderColumns.current}
                rows={folders}
                getRowId={getFolderRowId}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                rowSelection={false}
                onCellEditStop={(params, e) => {
                  handleRenameFolder(params, e);
                }}
                disableColumnMenu
                columnVisibilityModel={{ _id: false }}
              />
            ) : (
              <div className="pt-2 text-slate-400 font-semibold">
                Không tồn tại thư mục nào
              </div>
            )
          ) : (
            <CustomSkeleton />
          )}
        </div>
        <div className="pt-4">
          <h1 className="text-md font-semibold">Tài liệu</h1>
          {isFileExploreLoaded ? (
            files?.length > 0 ? (
              <DataGrid
                className="mt-1"
                columns={fileColumns.current}
                rows={files}
                getRowId={getFileRowId}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
                rowSelection={false}
                disableColumnMenu
                columnVisibilityModel={{ _id: false }}
              />
            ) : (
              <div className="pt-2 text-slate-400 font-semibold">
                Không tồn tại tệp nào
              </div>
            )
          ) : (
            <CustomSkeleton />
          )}
        </div>
      </div>
    </div>
  );
}

export default FileExplore;
