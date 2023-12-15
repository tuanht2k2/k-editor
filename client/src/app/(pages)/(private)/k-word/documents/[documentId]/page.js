"use client";

import Custom404 from "@/app/components/Custom404";

import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import { over } from "stompjs";
import SockJS from "sockjs-client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { debounce } from "lodash";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import HeadlessTippy from "@tippyjs/react/headless";

import parser from "html-react-parser";

import DocumentController from "@/app/components/FileController/DocumentController";
import AuthFile from "@/app/components/AuthFile";

import { Button, IconButton } from "@mui/material";
import { CloseOutlined, PreviewOutlined } from "@mui/icons-material";

function WordEditor() {
  const user = useSelector((state) => state.user);
  const splitPathName = usePathname().split("/");
  const fileId = splitPathName[splitPathName.length - 1];

  const [stompClient, setStompClient] = useState(null);
  const [file, setFile] = useState(null);
  const [isFileChecked, setIsFileChecked] = useState(false);
  const [isVaidFile, setIsValidFile] = useState(false);
  const [isPreviewPdfVisible, setIsPreviewPdfVisible] = useState(false);

  const [authForm, setAuthForm] = useState({
    isVisible: false,
    password: "",
    isBtnSpinning: false,
    error: "",
  });

  const handleAccessFile = () => {
    // save file id to db
    const api = `/users/${user._id}/access-file/${fileId}`;
    instance.post(api, {}, getApiConfig());
  };

  const handleTypingPassword = (value) => {
    setAuthForm((prev) => ({ ...prev, password: value, error: "" }));
  };

  const handleGetFileData = async (storedPassword) => {
    setAuthForm((prev) => ({ ...prev, isBtnSpinning: true }));
    const config = getApiConfig();
    const api = `/files/${fileId}`;
    const password = storedPassword || authForm.password;

    instance
      .post(api, { userId: user._id, filePassword: password }, config)
      .then((res) => {
        const resFile = res.data;
        handleAccessFile();
        setFile(resFile);
        !storedPassword && localStorage.setItem(fileId, authForm.password);
        setAuthForm((prev) => ({ ...prev, isVisible: false }));
      })
      .catch(() => {
        setAuthForm((prev) => ({ ...prev, error: "Mật khẩu không chính xác" }));
      })
      .finally(() => {
        setAuthForm((prev) => ({ ...prev, isBtnSpinning: false }));
      });
  };

  useEffect(() => {
    if (!file) return;
    const config = getApiConfig();
    const socket = new SockJS("http://localhost:8080/ws", config);
    const client = over(socket);
    client.connect({}, () => {
      client.subscribe(`/documents/k-word/${file._id}`, (res) => {
        const updateHistory = JSON.parse(res.body);

        const lastUpdate = updateHistory?.pop();
        if (lastUpdate.user._id == user._id) return;
        setFile((prev) => ({
          ...prev,
          data: lastUpdate.data,
        }));
      });
    });

    setStompClient(client);
    return () => {
      client.connected && client.disconnect();
    };
  }, [file]);

  // check bug
  const debounceFn = debounce((data) => handleUpdateFile(data), 300, {
    // maxWait: 2000,
  });

  const handleEditorChange = (data) => {
    debounceFn(data);
  };

  const handleUpdateFile = (data) => {
    if (!file) return;

    const action = {
      documentId: file._id,
      user: user,
      data: data,
      time: new Date(),
    };
    console.log(action);
    stompClient.send(
      `/app/documents/k-word/${fileId}`,
      {},
      JSON.stringify(action)
    );
  };

  // check is file id correct
  const handleCheckFileExisted = () => {
    const api = `/files/${fileId}/format=txt/check-file-existed`;
    instance
      .get(api, getApiConfig())
      .then(() => {
        const storedPassword = localStorage.getItem(fileId);
        if (storedPassword) {
          handleGetFileData(storedPassword).then(() => {
            setIsValidFile(true);
          });
        } else {
          setAuthForm((prev) => ({ ...prev, isVisible: true }));
        }
      })
      .catch(() => {
        setIsValidFile(false);
        setIsFileChecked(true);
      });
  };

  useEffect(() => {
    if (Object.keys(user).length == 0) {
      return;
    }
    handleCheckFileExisted();
  }, [user]);

  //download
  const pdfRef = useRef(null);
  const editorRef = useRef(null);

  // download
  const handleDownloadTxt = () => {
    if (!pdfRef.current) return;

    html2canvas(pdfRef.current).then((canvas) => {
      const imgData = new Image();
      const path = canvas.toDataURL("image/png");

      imgData.src = path;
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 20, imgWidth, imgHeight);
      pdf.save(`${file.name}.pdf`);
    });
  };

  return (
    <Fragment>
      {authForm.isVisible ? (
        <AuthFile
          fileId={fileId}
          handleTypingPassword={handleTypingPassword}
          passwordValue={authForm.password}
          isBtnSpinning={authForm.isBtnSpinning}
          error={authForm.error}
          handleAccessFile={() => handleGetFileData("")}
        />
      ) : !isVaidFile && isFileChecked ? (
        <Custom404 />
      ) : file ? (
        <div className="h-full p-5 pt-0">
          <HeadlessTippy
            visible={isPreviewPdfVisible}
            appendTo={document.body}
            interactive
            offset={[0, 0]}
            render={() => (
              <div className="w-screen h-[calc(100vh-15px)] flex items-center justify-center bg-slate-50/[.54]">
                <div className="bg-white flex flex-col w-3/4 h-3/4 border-2 rounded-md border-sky-400 overflow-hidden p-5">
                  <header className="flex items-center justify-between pb-2">
                    <div className="flex items-center font-semibold">
                      <PreviewOutlined className="text-sky-500 mr-3" />
                      Bản xem trước
                    </div>
                    <IconButton
                      onClick={() => {
                        setIsPreviewPdfVisible(false);
                      }}
                    >
                      <CloseOutlined />
                    </IconButton>
                  </header>
                  <div className="flex-1 border-2 border-slate-200 rounded-md p-3">
                    <div className="p-2" ref={pdfRef}>
                      {parser(editorRef.current?.editor?.getData() || "")}
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-end pt-2 ">
                    <Button
                      onClick={() => {
                        setIsPreviewPdfVisible(false);
                      }}
                      variant="outlined"
                      color="error"
                      style={{ marginRight: "10px" }}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleDownloadTxt}
                      variant="outlined"
                      color="info"
                    >
                      Tải xuống PDF
                    </Button>
                  </div>
                </div>
              </div>
            )}
          ></HeadlessTippy>

          <DocumentController
            file={file}
            wordFn={() => {
              setIsPreviewPdfVisible((prev) => !prev);
            }}
          />
          <CKEditor
            editor={ClassicEditor}
            ref={editorRef}
            onChange={(event, editor) => {
              const data = editor.getData();
              handleEditorChange(data);
            }}
            data={file.data || ""}
          />
        </div>
      ) : null}
    </Fragment>
  );
}

export default WordEditor;
