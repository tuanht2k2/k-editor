"use client";

import { registerLicense } from "@syncfusion/ej2-base";
registerLicense(
  "ORg4AjUWIQA/Gnt2VlhiQlVPd0BBQmFJfFdmTWlcflR0fUU3HVdTRHRcQ19jTX5bc0dnUHpddnY="
);

import "./spreadsheet.css";

import { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";

import { over } from "stompjs";
import SockJS from "sockjs-client";

import { SpreadsheetComponent } from "@syncfusion/ej2-react-spreadsheet";

import getApiConfig from "@/app/utils/getApiConfig";
import { instance } from "@/app/utils/axios";
import DocumentController from "@/app/components/DocumentController";
import CustomSkeleton from "@/app/components/CustomSkeleton";
import Custom404 from "@/app/components/Custom404";

function SheetEditor() {
  const user = useSelector((state) => state.user);

  const [sheet, setSheet] = useState(null);

  // get sheet id
  const splitPathName = usePathname().split("/");
  const sheetId = splitPathName[splitPathName.length - 1];

  const [stompClient, setStompClient] = useState(null);
  const spreadsheetRef = useRef(null);

  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const handleAccessFile = () => {
    // save file id to db
    const api = `/users/${user._id}/access-file/${sheetId}`;
    instance.post(api, {}, getApiConfig());
  };

  const handleGetSheetData = () => {
    const config = getApiConfig();
    const api = `/files/${sheetId}`;

    instance
      .get(api, config)
      .then((res) => {
        const resSheet = res.data;

        if (resSheet.format !== "xlsx") {
          setIsPageLoaded(true);
          return;
        }

        // get all spreadsheet update and set it to spreadsheet
        const sheetUpdateHistory = resSheet.sheetUpdateHistory || [];
        sheetUpdateHistory.forEach((update) => {
          const updateArgsObj = JSON.parse(update.updateArgsObj);
          spreadsheetRef.current?.updateAction(updateArgsObj);
        });

        setSheet(resSheet);
        handleAccessFile();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsPageLoaded(true));
  };

  // subcribe websocket
  useEffect(() => {
    if (!sheet || !spreadsheetRef.current) return;

    const socket = new SockJS("http://localhost:8080/ws", getApiConfig());
    const client = over(socket);
    client.connect({}, () => {
      client.subscribe(`/documents/k-sheet/${sheet._id}`, (res) => {
        const receivedJsonUpdate = JSON.parse(res.body);
        const updateArgsObj = JSON.parse(receivedJsonUpdate.updateArgsObj);
        spreadsheetRef.current.updateAction(updateArgsObj);
      });
    });
    setStompClient(client);

    return () => {
      client.connected && client.disconnect();
    };
  }, [sheet]);

  useEffect(() => {
    if (Object.keys(user).length == 0) {
      return;
    }
    handleGetSheetData();
  }, [user]);

  const handleActionComplete = (args) => {
    if (!sheet) return;

    const sheetUpdateAction = {
      sheetId: sheetId,
      userId: user._id,
      updateArgsObj: JSON.stringify(args),
      time: new Date(),
    };
    const data = JSON.stringify(sheetUpdateAction);
    stompClient.send(`/app/documents/k-sheet/${sheet._id}`, {}, data);
  };

  return (
    <Fragment>
      {!isPageLoaded ? (
        <CustomSkeleton />
      ) : sheet ? (
        <div className="h-[calc(100%-84px)]">
          <DocumentController file={sheet} reload={handleGetSheetData} />
          <SpreadsheetComponent
            ref={spreadsheetRef}
            actionComplete={(args) => {
              handleActionComplete(args);
            }}
            allowOpen={true}
            allowInsert={false}
          />
        </div>
      ) : (
        <Custom404 />
      )}
    </Fragment>
  );
}

export default SheetEditor;
