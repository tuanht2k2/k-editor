"use client";

import Custom404 from "@/app/components/Custom404";

import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import Stomp from "stompjs";
import SockJS from "sockjs-client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { debounce } from "lodash";

import DocumentController from "@/app/components/DocumentController";
import CustomSkeleton from "@/app/components/CustomSkeleton";

function WordEditor() {
  const handleSaveFile = (formatType) => {
    formatType == "Docx"
      ? container?.documentEditor.save("K-Editor", "Docx")
      : formatType == "Html"
      ? container?.documentEditor.save("K-Editor", "Html")
      : formatType == "Sfdt"
      ? container?.documentEditor.save("K-Editor", "Sfdt")
      : container?.documentEditor.save("K-Editor", "Txt");
  };
  const user = useSelector((state) => state.user);
  const splitPathName = usePathname().split("/");
  const documentId = splitPathName[splitPathName.length - 1];

  const [stompClient, setStompClient] = useState(null);
  const [document, setDocument] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // const [initiatingUpdateUser, setInitiatingUpdateUser] = useState(false);

  const [isEnabledChange, setIsEnabledChange] = useState(true);

  const handleGetDocumentData = () => {
    const config = getApiConfig();
    const api = `/files/${documentId}`;

    instance
      .get(api, config)
      .then((res) => {
        const resDocument = res.data;
        setDocument(resDocument);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsPageLoaded(true));
  };

  useEffect(() => {
    Object.keys(user).length > 0 && handleGetDocumentData();
  }, [user]);

  useEffect(() => {
    if (!document) return;
    const config = getApiConfig();
    const socket = new SockJS("http://localhost:8080/ws", config);
    const client = Stomp.over(socket);
    client.connect({}, () => {
      client.subscribe(`/document/k-word/${document._id}`, (res) => {
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
  const debounceFn = debounce((data) => handleUpdateDocument(data), 400, {
    // maxWait: 2000,
  });

  const handleEditorChange = (data) => {
    debounceFn(data);
  };

  const handleUpdateDocument = (data) => {
    if (!document) return;

    const action = {
      userId: user?._id,
      data: data,
      time: new Date(),
    };

    stompClient.send(
      `/document/k-word/${documentId}`,
      {},
      JSON.stringify(action)
    );

    // alert("changed " + user.username);

    const config = getApiConfig();
    const documentUpdateApi = `files/txt/${document._id}/update`;
    const reqBody = action;
    instance.post(documentUpdateApi, reqBody, config);
  };

  return (
    <Fragment>
      {isPageLoaded && !document ? (
        <Custom404 />
      ) : document ? (
        <div className="h-full p-5">
          <DocumentController
            document={document}
            reload={handleGetDocumentData}
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
      ) : (
        <CustomSkeleton />
      )}
    </Fragment>
  );
}

export default WordEditor;
