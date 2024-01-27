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

import Custom404 from "@/app/components/Custom404";
import DocumentController from "@/app/components/FileController/DocumentController";
import AuthFile from "@/app/components/AuthFile";

function SheetEditor() {
  const user = useSelector((state) => state.user);

  const [sheet, setSheet] = useState(null);

  const [authForm, setAuthForm] = useState({
    isVisible: false,
    password: "",
    isBtnSpinning: false,
    error: "",
  });

  // get sheet id
  const splitPathName = usePathname().split("/");
  const sheetId = splitPathName[splitPathName.length - 1];

  const [stompClient, setStompClient] = useState(null);
  const spreadsheetRef = useRef(null);

  const [isSheetChecked, setIsSheetChecked] = useState(false);
  const [isVaidSheet, setIsValidSheet] = useState(false);

  const handleTypingPassword = (value) => {
    setAuthForm((prev) => ({ ...prev, password: value, error: "" }));
  };

  const handleAccessFile = () => {
    // save file id to db
    const api = `/users/${user._id}/access-file/${sheetId}`;
    instance.post(api, {}, getApiConfig());
  };

  const handleGetSheetData = async (storedPassword) => {
    setAuthForm((prev) => ({ ...prev, isBtnSpinning: true }));
    const config = getApiConfig();
    const api = `/files/${sheetId}`;
    const password = storedPassword || authForm.password;

    instance
      .post(api, { userId: user._id, filePassword: password }, config)
      .then((res) => {
        const resSheet = res.data;
        // get all spreadsheet update and set it to spreadsheet
        const sheetUpdateHistory = resSheet.sheetUpdateHistory || [];
        sheetUpdateHistory.forEach((updateGroup) => {
          updateGroup.actions?.forEach((jsonUpdate) => {
            const update = JSON.parse(jsonUpdate);
            spreadsheetRef.current?.updateAction(update);
          });
        });

        setSheet(resSheet);
        handleAccessFile();
        localStorage.setItem(sheetId, password || "1");
        setAuthForm((prev) => ({ ...prev, isVisible: false }));
      })
      .catch(() => {
        setAuthForm((prev) => ({ ...prev, error: "Mật khẩu không chính xác" }));
      })
      .finally(() => {
        setAuthForm((prev) => ({ ...prev, isBtnSpinning: false }));
      });
  };

  // subcribe websocket
  useEffect(() => {
    if (!sheet || !spreadsheetRef.current) return;

    const socket = new SockJS(
      "https://k-editor-service.onrender.com/ws",
      // "http://localhost:8080/ws",
      getApiConfig()
    );
    const client = over(socket);
    client.connect({}, () => {
      client.subscribe(`/documents/k-sheet/${sheet._id}`, (res) => {
        const updateGroups = JSON.parse(res.body);

        const lastUpdateGroup = updateGroups.pop();
        const lastJsonUpdate = lastUpdateGroup.actions.pop();
        const lastUpdate = JSON.parse(lastJsonUpdate);
        spreadsheetRef.current.updateAction(lastUpdate);
      });
    });
    setStompClient(client);

    return () => {
      client.connected && client.disconnect();
    };
  }, [sheet]);

  const handleActionComplete = (args) => {
    if (!sheet) return;

    const sheetUpdateAction = {
      sheetId: sheetId,
      user: user,
      action: JSON.stringify(args),
      time: new Date(),
    };
    const data = JSON.stringify(sheetUpdateAction);
    stompClient.send(`/app/documents/k-sheet/${sheet._id}`, {}, data);
  };

  // check is sheet id correct
  const handleCheckSheetExisted = () => {
    const api = `/files/${sheetId}/format=xlsx/check-file-existed`;
    instance
      .get(api, getApiConfig())
      .then(() => {
        const storedPassword = localStorage.getItem(sheetId);
        if (storedPassword) {
          handleGetSheetData(storedPassword).then(() => {
            setIsValidSheet(true);
          });
        } else {
          // if local storage does not store sheet password
          setAuthForm((prev) => ({ ...prev, isVisible: true }));
        }
      })
      .catch(() => {
        //if sheet is not existed
        setIsValidSheet(false);
        setIsSheetChecked(true);
      });
  };

  // save
  const handleSave = () => {};

  useEffect(() => {
    if (Object.keys(user).length == 0) {
      return;
    }
    handleCheckSheetExisted();
  }, [user]);

  return (
    <Fragment>
      {authForm.isVisible ? (
        <AuthFile
          fileId={sheetId}
          handleTypingPassword={handleTypingPassword}
          passwordValue={authForm.password}
          isBtnSpinning={authForm.isBtnSpinning}
          error={authForm.error}
          handleAccessFile={() => handleGetSheetData("")}
        />
      ) : !isVaidSheet && isSheetChecked ? (
        <Custom404 />
      ) : sheet ? (
        <div className="h-[calc(100%-84px)]">
          <DocumentController file={sheet} sheetFn={handleSave} />
          <SpreadsheetComponent
            ref={spreadsheetRef}
            actionComplete={(args) => {
              handleActionComplete(args);
            }}
            // allowOpen={true}
            // openUrl="https://services.syncfusion.com/react/production/api/spreadsheet/open"
            allowInsert={false}
            allowSave={true}
            saveUrl="https://services.syncfusion.com/react/production/api/spreadsheet/save"
          />
        </div>
      ) : null}
    </Fragment>
  );
}

export default SheetEditor;
