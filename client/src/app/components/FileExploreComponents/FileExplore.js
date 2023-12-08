"use client";

import { useRef, useState } from "react";

import Link from "next/link";

import {
  CachedOutlined,
  CreateNewFolderOutlined,
  DeleteOutline,
  DriveFolderUpload,
  FileOpenOutlined,
  Folder,
  FolderDeleteOutlined,
  FolderOpenOutlined,
  GridOn,
  TextSnippetOutlined,
  WestOutlined,
} from "@mui/icons-material";

import { Breadcrumbs, Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import dateFormat from "dateformat";

import { instance } from "../../utils/axios";
import getApiConfig from "../../utils/getApiConfig";

import CustomSkeleton from "../CustomSkeleton";
import CustomSnackBar from "../CustomSnackBar";
import ConfirmBox from "../ConfirmBox";

function FileExplore({
  componentType,
  userId,
  parentFolder,
  folders,
  files,
  isFileExploreLoaded,
  handleGetFolderData,
}) {
  const [confirmBoxVisibleId, setConfirmBoxVisibleId] = useState(null);

  // snackbar
  const [snackBarData, setSnackBarData] = useState({
    open: false,
    content: "",
    severity: "",
  });

  const folderColumns = [
    {
      field: "format",
      headerName: "Phân loại",
      renderCell: () => (
        <div className="flex items-center">
          <Folder className="text-yellow-600" />
          <span className="ml-2 text-yellow-600 text-xs font-semibold">
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
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      width: 300,
      renderCell: (params) => <span>{dateFormat(params.row.createdAt)}</span>,
    },
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
      renderCell: (params) => (
        <ConfirmBox
          visible={confirmBoxVisibleId == params.row._id}
          header={"Xóa tất cả tệp và tài liệu con ?"}
          onConfirm={() => {
            handleDeleteFolder(params.row._id);
            setConfirmBoxVisibleId(null);
          }}
          onCancel={() => {
            setConfirmBoxVisibleId(null);
          }}
        >
          <div
            className="rounded-full p-2 hover:bg-slate-200 duration-150 cursor-pointer"
            onClick={() => {
              setConfirmBoxVisibleId(
                confirmBoxVisibleId == params.row._id ? null : params.row._id
              );
            }}
          >
            <FolderDeleteOutlined
              className="text-red-500"
              titleAccess="Xóa thư mục"
            />
          </div>
        </ConfirmBox>
      ),
    },
  ];

  const fileColumns = [
    {
      field: "format",
      headerName: "Phân loại",
      renderCell: (params) => (
        <div>
          {params.formattedValue == "xlsx" ? (
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
      editable: true,
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      width: 350,
      renderCell: (params) => <span>{dateFormat(params.row.createdAt)}</span>,
    },
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
        <Link
          href={`/${
            params.row.format == "xlsx" ? "k-sheet" : "k-word"
          }/documents/${params.id}`}
        >
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
      renderCell: (params) => (
        <ConfirmBox
          visible={confirmBoxVisibleId == params.row._id}
          header={"Bạn muốn xóa tệp này không ?"}
          onConfirm={() => {
            handleDeleteFile(params.row._id);
            setConfirmBoxVisibleId(null);
          }}
          onCancel={() => {
            setConfirmBoxVisibleId(null);
          }}
        >
          <div
            className="rounded-full p-2 hover:bg-slate-200 duration-150 cursor-pointer"
            onClick={() => {
              setConfirmBoxVisibleId(
                confirmBoxVisibleId == params.row._id ? null : params.row._id
              );
            }}
          >
            <DeleteOutline
              className="text-red-500"
              titleAccess="Xóa tài liệu"
            />
          </div>
        </ConfirmBox>
      ),
    },
  ];

  const [createFolderFormData, setCreateFolderFormData] = useState({
    isVisble: false,
    value: "",
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
      .then(() => {
        handleGetFolderData();
        setSnackBarData(() => ({
          open: true,
          content: "Tạo thư mục thành công",
          severity: "success",
          placement: { vertical: "bottom", horizontal: "right" },
        }));
      })
      .catch(() => {})
      .finally(() => {
        setCreateFolderFormData((prev) => ({
          ...prev,
          isSubmitBtnSpinning: false,
          isVisble: false,
        }));
      });
  };

  const handleDeleteFolder = (folderId) => {
    const api = `folders/${folderId}/delete`;

    instance
      .delete(api, getApiConfig())
      .then(() => {
        handleGetFolderData();
        setSnackBarData(() => ({
          open: true,
          content: "Xóa thư mục thành công",
          severity: "success",
          placement: { vertical: "bottom", horizontal: "right" },
        }));
      })
      .catch(() => {
        setSnackBarData(() => ({
          open: true,
          content: "Không thể xóa thư mục",
          severity: "error",
          placement: { vertical: "bottom", horizontal: "right" },
        }));
      });
  };

  const handleRenameFolder = (dataGridParams, event) => {
    const folder = dataGridParams.row;
    const newName = event.target?.value;

    if (!newName) return;
    if (folder.name == newName || !newName.trim()) return;

    const config = getApiConfig();

    instance
      .patch(`folders/${folder?._id}/new-name=${newName}`, {}, config)
      .then(() => {
        setSnackBarData(() => ({
          open: true,
          content: "Đổi tên thư mục thành công",
          severity: "success",
          placement: { vertical: "bottom", horizontal: "left" },
        }));
      })
      .catch((err) => console.log(err));
  };

  const handleRenameFile = (dataGridParams, event) => {
    const file = dataGridParams.row;
    const newName = event.target?.value;

    if (!newName) return;
    if (file.name == newName || !newName.trim()) return;

    const config = getApiConfig();

    instance
      .patch(`files/${file?._id}/new-name=${newName}`, {}, config)
      .then((res) => {})
      .then(() => {
        setSnackBarData(() => ({
          open: true,
          content: "Đổi tên file thành công",
          severity: "success",
          placement: { vertical: "bottom", horizontal: "left" },
        }));
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteFile = (fileId) => {
    const api = `files/${fileId}/delete`;

    instance
      .delete(api, getApiConfig())
      .then(() => {
        handleGetFolderData();
        setSnackBarData(() => ({
          open: true,
          content: "Xóa file thành công",
          severity: "success",
          placement: { vertical: "bottom", horizontal: "right" },
        }));
      })
      .catch(() => {
        setIsErrorSnackBarVisible(true);
      });
  };

  return (
    <div className="mt-5 border-slate-200 border-2 p-5 rounded-xl">
      <CustomSnackBar
        open={snackBarData.open}
        onCLose={() => {
          setSnackBarData((prev) => ({ ...prev, open: false }));
        }}
        content={snackBarData.content}
        severity={snackBarData.severity || "info"}
        placement={snackBarData.placement}
      />

      <div className="flex justify-between items-center">
        <div className="flex item-center">
          <h1 className="font-bold flex items-center text-2xl ">
            <span className="mr-2 text-slate-600">
              Quản lí tài nguyên <FolderOpenOutlined />
            </span>
          </h1>
          {componentType !== "file-explore" && (
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
                value: "",
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
            href={`/${componentType}/${parentFolder._id}`}
            color="red"
            className={`rounded-sm p-1 text-sm underline`}
          >
            {parentFolder.name}
          </Link>
        )}
      </Breadcrumbs>

      {/* folder */}
      <div>
        <div className="pt-4">
          <h1 className="text-md font-semibold">Thư mục</h1>
          {/* create file */}
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
                onKeyDown={(e) => {
                  e.key === "Enter" && handleCreateFolder();
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
                columns={folderColumns}
                rows={folders}
                getRowId={getFolderRowId}
                initialState={
                  {
                    // pagination: {
                    //   paginationModel: { page: 0, pageSize: 5 },
                    // },
                  }
                }
                // pageSizeOptions={[5, 10]}
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

        {/* file */}
        <div className="pt-4">
          <h1 className="text-md font-semibold">Tài liệu</h1>
          {isFileExploreLoaded ? (
            files?.length > 0 ? (
              <DataGrid
                className="mt-1"
                columns={fileColumns}
                rows={files}
                getRowId={getFileRowId}
                initialState={
                  {
                    // pagination: {
                    //   paginationModel: { page: 0, pageSize: 5 },
                    // },
                  }
                }
                // pageSizeOptions={[5, 10]}
                rowSelection={false}
                onCellEditStop={(params, e) => {
                  handleRenameFile(params, e);
                }}
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
