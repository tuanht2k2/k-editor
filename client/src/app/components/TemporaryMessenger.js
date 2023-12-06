import { useState } from "react";

import { Alert, Button, Snackbar, TextField } from "@mui/material";
import {
  ContentCopyOutlined,
  MicOutlined,
  RemoveOutlined,
  SendOutlined,
  TextSnippetOutlined,
} from "@mui/icons-material";

import CustomIconButtonWrapper from "./CustomIconButtonWrapper";

import dateFormat from "dateformat";
import { useSelector } from "react-redux";

import { useEffect } from "react";
import { useRef } from "react";

import { over } from "stompjs";
import SockJS from "sockjs-client";

function TemporaryMessenger({ document, hideWindowFn }) {
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState([]);

  const messengerRef = useRef(null);

  const messageTextFieldRef = useRef(null);

  const [isCopySnackBarVisible, setIsCopySnackBarVisible] = useState(false);

  const user = useSelector((state) => state.user);

  const handleMessageChange = (message) => {
    setMessageContent(message);
  };

  // config websocket
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");

    const client = over(socket);
    client.connect(
      {},
      () => {
        client.subscribe(`/documents/${document._id}/messenger`, (payload) => {
          const messagesRes = JSON.parse(payload.body);
          setMessages([...messagesRes]);
        });
      },
      () => {}
    );
    setStompClient(client);

    return () => {
      client.connected && client.disconnect();
    };
  }, [messages]);

  useEffect(() => {
    if (messengerRef.current) {
      const scroll =
        messengerRef.current.scrollHeight - messengerRef.current.offsetHeight;
      messengerRef.current.scrollTop = scroll;
    }

    return () => {};
  });

  const handleSendMessage = (messageObj) => {
    stompClient.send(
      `/app/documents/${document._id}/messenger`,
      {},
      JSON.stringify(messageObj)
    );
  };

  return (
    <div className=" border-slate-50 rounded-md">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center font-semibold text-lg">
          {`Cuộc họp tạm thời`}
          <span className="font-semibold text-sm italic text-slate-500">
            <TextSnippetOutlined
              className="ml-2 text-sky-500"
              fontSize="small"
            />
            {`${"text-tuan-1.txt"}`}
          </span>
        </div>
        <button
          className="ml-4 p-1 rounded-full duration-150 flex justify-center align-center bg-slate-100 hover:bg-slate-200 hover:[&>*]:text-red-400 self-center"
          title="Đóng cuộc trò chuyện"
          onClick={hideWindowFn}
        >
          <RemoveOutlined className="text-red-600" fontSize="small" />
        </button>
      </div>
      <div
        className={`max-h-[calc(100vh-300px)] ${
          messages.length > 0 &&
          "border-b-2  border-t-2 border-slate-400 overflow-y-scroll "
        }`}
        ref={messengerRef}
      >
        {user && messages.length > 0 ? (
          <ul className="pl-4 pr-4 pb-4 flex flex-col">
            {messages.map((message, index) => (
              <li
                key={`message ${index}`}
                className={`mt-4 flex items-start ${
                  user._id == message.author._id && "self-end flex-row-reverse"
                }`}
              >
                <div
                  className={`flex flex-col border-2 border-slate-200 rounded-2xl p-1 ${
                    user._id == message.author._id ? "items-end" : "items-start"
                  }`}
                >
                  <span className="font-semibold text-xs text-slate-500">
                    {message.author.username}
                  </span>
                  <img
                    className="object-cover h-6"
                    src={
                      message.author.avtImage
                        ? message.author.avtImage
                        : "/assets/images/profile_image.png"
                    }
                  />
                </div>
                <div
                  className={`ml-2 mr-2 border-2 border-slate-100 h-full rounded-2xl p-2 ${
                    user._id == message.author._id && "bg-slate-50"
                  }`}
                >
                  <div className="">{message.content}</div>
                  <div className="text-xs italic text-slate-400">
                    {dateFormat(message.time)}
                  </div>
                </div>
                <button
                  className="p-1 rounded-full duration-150 flex justify-center align-center hover:bg-slate-200 hover:[&>*]:text-sky-400 self-center"
                  title="Sao chép vào bộ nhớ tạm"
                  onClick={() => {
                    navigator.clipboard.writeText(message.content);
                    setIsCopySnackBarVisible(true);
                  }}
                >
                  <ContentCopyOutlined
                    className="text-sky-600"
                    fontSize="small"
                  />
                </button>
                {/* SnackBar */}
                <Snackbar
                  open={isCopySnackBarVisible}
                  autoHideDuration={3000}
                  onClose={() => {
                    setIsCopySnackBarVisible(false);
                  }}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <Alert
                    severity="success"
                    sx={{ width: "100%" }}
                    onClose={() => {
                      setIsCopySnackBarVisible(false);
                    }}
                  >
                    Đã sao chép nội dung vào bộ nhớ tạm
                  </Alert>
                </Snackbar>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-slate-400 font-semibold p-3">
            Chưa có tin nhắn nào
          </div>
        )}
      </div>
      <div className="flex pt-3">
        <TextField
          value={messageContent}
          error={!messageContent.trim()}
          placeholder="Nhập tin nhắn"
          onChange={(e) => {
            handleMessageChange(e.target.value);
          }}
          ref={messageTextFieldRef}
        />
        <div className="flex items-center">
          <div className="ml-4 flex items-center justify-center">
            <CustomIconButtonWrapper title={"Ghi âm"} className={"p-2"}>
              <MicOutlined className={``} fontSize="small" />
            </CustomIconButtonWrapper>
          </div>
          <div className="ml-4 mr-4 flex items-center justify-center">
            <Button
              variant="outlined"
              title="Gửi tin nhắn"
              disabled={!messageContent.trim()}
              onClick={() => {
                const messageObj = {
                  author: user,
                  content: messageContent,
                  time: new Date(),
                };
                handleSendMessage(messageObj);
                setMessageContent("");
                messageTextFieldRef.current?.focus();
              }}
            >
              <SendOutlined className={``} fontSize="small" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemporaryMessenger;
