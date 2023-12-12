"use client";

import Custom404 from "@/app/components/Custom404";

import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import { over } from "stompjs";
import SockJS from "sockjs-client";

import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { debounce } from "lodash";

import DocumentController from "@/app/components/DocumentController";
import AuthFile from "@/app/components/AuthFile";

function WordEditor() {
  const user = useSelector((state) => state.user);
  const splitPathName = usePathname().split("/");
  const documentId = splitPathName[splitPathName.length - 1];

  const [stompClient, setStompClient] = useState(null);
  const [document, setDocument] = useState(null);
  const [isDocumentChecked, setIsDocumentChecked] = useState(false);
  const [isVaidDocument, setIsValidDocument] = useState(false);

  const [authForm, setAuthForm] = useState({
    isVisible: false,
    password: "",
    isBtnSpinning: false,
    error: "",
  });

  const handleAccessDocument = () => {
    // save file id to db
    const api = `/users/${user._id}/access-file/${documentId}`;
    instance.post(api, {}, getApiConfig());
  };

  const handleTypingPassword = (value) => {
    setAuthForm((prev) => ({ ...prev, password: value, error: "" }));
  };

  const handleGetDocumentData = async (storedPassword) => {
    setAuthForm((prev) => ({ ...prev, isBtnSpinning: true }));
    const config = getApiConfig();
    const api = `/files/${documentId}`;
    const password = storedPassword || authForm.password;

    instance
      .post(api, { userId: user._id, filePassword: password }, config)
      .then((res) => {
        const resDocument = res.data;
        handleAccessDocument();
        setDocument(resDocument);
        !storedPassword && localStorage.setItem(documentId, authForm.password);
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
    if (!document) return;
    const config = getApiConfig();
    const socket = new SockJS("http://localhost:8080/ws", config);
    const client = over(socket);
    client.connect({}, () => {
      client.subscribe(`/documents/k-word/${document._id}`, (res) => {
        const action = JSON.parse(res.body);
        setDocument((prev) => ({
          ...prev,
          data: action.data,
        }));
      });
    });

    setStompClient(client);
    return () => {
      client.connected && client.disconnect();
    };
  }, [document]);

  // check bug
  const debounceFn = debounce((data) => handleUpdateDocument(data), 300, {
    // maxWait: 2000,
  });

  const handleEditorChange = (data) => {
    debounceFn(data);
  };

  const handleUpdateDocument = (data) => {
    if (!document) return;

    const action = {
      documentId: document._id,
      userId: user?._id,
      data: data,
      time: new Date(),
    };

    stompClient.send(
      `/app/documents/k-word/${documentId}`,
      {},
      JSON.stringify(action)
    );
  };

  // check is document id correct
  const handleCheckDocumentExisted = () => {
    const api = `/files/${documentId}/format=txt/check-file-existed`;
    instance
      .get(api, getApiConfig())
      .then(() => {
        const storedPassword = localStorage.getItem(documentId);
        if (storedPassword) {
          handleGetDocumentData(storedPassword).then(() => {
            setIsValidDocument(true);
          });
        } else {
          setAuthForm((prev) => ({ ...prev, isVisible: true }));
        }
      })
      .catch(() => {
        setIsValidDocument(false);
        setIsDocumentChecked(true);
      });
  };

  useEffect(() => {
    if (Object.keys(user).length == 0) {
      return;
    }
    handleCheckDocumentExisted();
  }, [user]);
  return (
    <Fragment>
      {authForm.isVisible ? (
        <AuthFile
          fileId={documentId}
          handleTypingPassword={handleTypingPassword}
          passwordValue={authForm.password}
          isBtnSpinning={authForm.isBtnSpinning}
          error={authForm.error}
          handleAccessFile={() => handleGetDocumentData("")}
        />
      ) : !isVaidDocument && isDocumentChecked ? (
        <Custom404 />
      ) : document ? (
        <div className="h-full p-5 pt-0">
          <DocumentController
            file={document}
            reload={() => handleGetDocumentData("")}
          />
          <CKEditor
            editor={ClassicEditor}
            onChange={(event, editor) => {
              const data = editor.getData();
              // if (data == document.data) return
              handleEditorChange(data);
            }}
            data={document.data || ""}
          />
        </div>
      ) : null}
    </Fragment>
  );
}

export default WordEditor;
