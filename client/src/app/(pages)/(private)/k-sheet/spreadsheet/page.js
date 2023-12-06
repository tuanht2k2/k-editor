"use client";

import { registerLicense } from "@syncfusion/ej2-base";
registerLicense(
  "ORg4AjUWIQA/Gnt2VlhiQlVPd0BBQmFJfFdmTWlcflR0fUU3HVdTRHRcQ19jTX5bc0dnUHpddnY="
);

import "./spreadsheet.css";

import {
  SpreadsheetComponent,
  SheetsDirective,
  SheetDirective,
  RangesDirective,
  CollaborativeEditArgs,
} from "@syncfusion/ej2-react-spreadsheet";

import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { useEffect, useRef, useState } from "react";

function CollaborativeEditing() {
  const [stompClient, setStompClient] = useState(null);
  const spreadsheetRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    const socket = new SockJS("http://localhost:8080/ws", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const client = Stomp.over(socket);
    client.connect({}, () => {
      client.subscribe("/document/spreadsheet", (res) => {
        const receivedAction = JSON.parse(res.body);
        console.log(receivedAction);
        spreadsheetRef.current.updateAction(receivedAction);
      });
    });
    setStompClient(client);
    return () => {
      client.connected && client.disconnect();
    };
  }, []);

  const handleActionComplete = (args) => {
    stompClient.send("/document/spreadsheet", {}, JSON.stringify(args));
  };

  return (
    <SpreadsheetComponent
      ref={spreadsheetRef}
      actionComplete={handleActionComplete}
      allowOpen={true}
      openUrl="https://services.syncfusion.com/react/production/api/spreadsheet/open"
    ></SpreadsheetComponent>
  );
}

export default CollaborativeEditing;
