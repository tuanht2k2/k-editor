import "regenerator-runtime/runtime";

import { Fragment, useState } from "react";

import { Alert, Button, Snackbar, TextField } from "@mui/material";
import {
  BackspaceOutlined,
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

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import RegularTippy from "./RegularTippy";

function TemporaryMessenger({ document, hideWindowFn }) {
  const [messageContent, setMessageContent] = useState("");
  const [messenger, setMessages] = useState([]);

  const messengerRef = useRef(null);

  const messageTextFieldRef = useRef(null);

  const [isCopySnackBarVisible, setIsCopySnackBarVisible] = useState(false);

  const user = useSelector((state) => state.user);

  const handleMessageChange = (message) => {
    setMessageContent(message);
  };

  // config websocket
  const [stompClient, setStompClient] = useState(null);

  // webSocket config
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    // const socket = new SockJS("https://k-editor-service.onrender.com/ws");

    const client = over(socket);
    client.connect(
      {},
      () => {
        client.subscribe(`/documents/${document._id}/messenger`, (payload) => {
          const messenger = JSON.parse(payload.body);
          setMessages(messenger);
        });

        // send notification to server: client connected

        const notificationMessage = {
          user: user,
          content: "Client join room!",
          time: new Date(),
          type: "notification",
        };
        client.send(
          `/app/documents/${document._id}/messenger`,
          {},
          JSON.stringify(notificationMessage)
        );
      },
      () => {}
    );
    setStompClient(client);

    return () => {
      client.connected && client.disconnect();
    };
  }, [document]);

  useEffect(() => {
    if (messengerRef.current) {
      const scroll =
        messengerRef.current.scrollHeight - messengerRef.current.offsetHeight;
      messengerRef.current.scrollTop = scroll;
    }

    return () => {};
  });

  const handleSendMessage = () => {
    if (!stompClient) return;

    const messageObj = {
      user: user,
      content: messageContent,
      time: new Date(),
      type: "normal",
    };

    setMessageContent("");
    messageTextFieldRef.current?.focus();

    stompClient.send(
      `/app/documents/${document._id}/messenger`,
      {},
      JSON.stringify(messageObj)
    );
  };

  // speech to text
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  return (
    <div className=" border-slate-50 rounded-md">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center font-semibold text-lg">
          <span className="font-semibold text-sm italic text-slate-500">
            <TextSnippetOutlined className="text-sky-500" fontSize="small" />
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

      {/* messenger */}
      <div
        className={`max-h-[calc(100vh-350px)] ${
          messenger.messages?.find(
            (message) => message.type != "notification"
          ) &&
          "border-b-2  border-t-2 border-l-2 border-slate-200 rounded-md overflow-y-scroll"
        }`}
        ref={messengerRef}
      >
        {messenger.messages?.length > 0 ? (
          <ul className="pl-1 pr-1 pb-4 flex flex-col">
            {messenger.messages.map((message, index) => {
              return (
                message.type === "normal" && (
                  <li
                    key={`message ${index}`}
                    className={`mt-4 flex flex-col items-start ${
                      user._id == message.user._id &&
                      "self-end flex-row-reverse items-end"
                    }`}
                    title="Nhấp đúp vào để sao chép nội dung"
                    onDoubleClick={() => {
                      navigator.clipboard.writeText(message.content);
                      setIsCopySnackBarVisible(true);
                    }}
                  >
                    <div
                      className={`flex rounded-2xl items-center mb-1 border-t-2 border-sky-300 ${
                        user._id == message.user._id
                          ? "border-l-2"
                          : "border-r-2"
                      }`}
                    >
                      <span className="font-semibold text-xs text-slate-500 p-1">
                        {message.user.username}
                      </span>
                      <img
                        className="mt-1 object-cover h-8 w-8 rounded-full"
                        src={
                          message.user.profileImage
                            ? message.user.profileImage
                            : "/assets/images/profile_image.png"
                        }
                      />
                    </div>
                    <div
                      className={`border-2 border-slate-100 h-full rounded-2xl p-2 ${
                        user._id == message.user._id && "bg-slate-50"
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div className="text-xs italic text-slate-400 select-none">
                        {dateFormat(message.time)}
                      </div>
                    </div>
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
                )
              );
            })}
          </ul>
        ) : (
          <div className="font-semibold p-3 [&>*]:text-slate-400 flex items-center justify-center">
            <BackspaceOutlined fontSize="medium" />
            <span className="ml-2">Chưa có tin nhắn nào</span>
          </div>
        )}
      </div>
      <div className="flex pt-3">
        <TextField
          value={messageContent}
          error={!messageContent.trim()}
          placeholder="Nhập tin nhắn"
          inputRef={messageTextFieldRef}
          multiline
          maxRows={3}
          onChange={(e) => {
            handleMessageChange(e.target.value);
          }}
          onKeyDown={(e) => {
            if (
              (e.ctrlKey && e.key === "Enter") ||
              (e.shiftKey && e.key === "Enter")
            ) {
              setMessageContent((prev) => prev + "\n");
              return;
            }

            if (e.key === "Enter" && messageContent.trim()) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <div className="flex items-center">
          <div className="ml-4 flex items-center justify-center">
            <RegularTippy
              render={
                <div className="flex flex-col items-center justify-center pt-2 pb-2">
                  <span>
                    {transcript ? "Đang ghi âm..." : "Thử nói gì đó..."}
                  </span>
                  <div className="flex items-center justify-center mt-5 mb-5 p-3 rounded-full bg-sky-100">
                    <div className="absolute w-9 h-9 rounded-full bg-sky-100 animate-ping duration-500"></div>
                    <MicOutlined className="text-red-400" />
                  </div>
                  <div>{transcript}</div>
                </div>
              }
              visible={listening}
            >
              <button
                className={`flex items-center justify-center p-3 hover:bg-slate-200 rounded-full duration-300  ${
                  listening && "bg-slate-200"
                } `}
                title={`${
                  !browserSupportsSpeechRecognition
                    ? "Trình duyệt hiện tại không hỗ trợ chức năng này"
                    : !listening
                    ? "Chuyển giọng nói thành văn bản"
                    : "Dừng ghi âm"
                }`}
                onClick={
                  browserSupportsSpeechRecognition
                    ? () => {
                        if (listening) {
                          setMessageContent((prev) => prev + transcript);
                          SpeechRecognition.stopListening();
                          resetTranscript();
                        } else {
                          SpeechRecognition.startListening({
                            continuous: true,
                          });
                        }
                      }
                    : null
                }
              >
                {
                  <MicOutlined
                    className={`${listening ? "text-sky-400" : "text-sky-600"}`}
                    fontSize="medium"
                  />
                }
              </button>
            </RegularTippy>
          </div>
          <div className="ml-4 mr-4 flex items-center justify-center">
            <Button
              variant="outlined"
              title="Gửi tin nhắn"
              disabled={!messageContent.trim()}
              onClick={() => {
                handleSendMessage();
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
