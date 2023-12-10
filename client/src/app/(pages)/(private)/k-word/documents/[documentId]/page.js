"use client";

import Custom404 from "@/app/components/Custom404";

import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import Stomp, { over } from "stompjs";
import SockJS from "sockjs-client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { debounce } from "lodash";

import DocumentController from "@/app/components/DocumentController";
import CustomSkeleton from "@/app/components/CustomSkeleton";

function WordEditor() {
  const user = useSelector((state) => state.user);
  const splitPathName = usePathname().split("/");
  const documentId = splitPathName[splitPathName.length - 1];

  const [stompClient, setStompClient] = useState(null);
  const [document, setDocument] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const handleAccessDocument = () => {
    // save file id to db
    const api = `/users/${user._id}/access-file/${documentId}`;
    console.log(api);
    instance.post(api, {}, getApiConfig());
  };

  const handleGetDocumentData = () => {
    const config = getApiConfig();
    const api = `/files/${documentId}`;

    instance
      .get(api, config)
      .then((res) => {
        const resDocument = res.data;
        if (resDocument.format !== "txt") {
          setIsPageLoaded(true);
          return;
        }
        handleAccessDocument();
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
    const client = over(socket);
    client.connect({}, () => {
      client.subscribe(`/documents/k-word/${document._id}`, (res) => {
        const action = JSON.parse(res.body);
        setDocument((prev) => ({
          ...prev,
          data: action.data,
        }));
        console.log("vai ca dai ", action);
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

  return (
    <Fragment>
      {isPageLoaded && !document ? (
        <Custom404 />
      ) : document ? (
        <div className="h-full p-5">
          <DocumentController file={document} reload={handleGetDocumentData} />
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
