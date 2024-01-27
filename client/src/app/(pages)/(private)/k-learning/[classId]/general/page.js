"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { over } from "stompjs";
import SockJS from "sockjs-client";

import { MailOutlined, SendOutlined } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";

import dateFormat from "dateformat";

import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";

import CustomCircularProgress from "@/app/components/CustomCircularProgress";

function General({ params }) {
  const user = useSelector((state) => state.user);

  const [messages, setMessages] = useState("loading");

  const [messageContent, setMessageContent] = useState("");

  const messageTextFieldRef = useRef(null);

  // config websocket
  const [stompClient, setStompClient] = useState(null);

  const handleGetMessages = () => {
    const api = `classes/${params.classId}/messages`;
    instance
      .get(api, getApiConfig())
      .then((res) => {
        setMessages(res.data);
      })
      .catch(() => {});
  };

  // webSocket config
  useEffect(() => {
    // get messages
    handleGetMessages();

    // const socket = new SockJS("http://localhost:8080/ws");
    const socket = new SockJS("https://k-editor-service.onrender.com/ws");

    const client = over(socket);
    client.connect(
      {},
      () => {
        client.subscribe(`/classes/${params.classId}/messenger`, (payload) => {
          const messages = JSON.parse(payload.body);
          setMessages(messages);
        });
      },
      () => {}
    );
    setStompClient(client);

    return () => {
      client.connected && client.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (!stompClient) return;

    const newMesasge = {
      classId: params.classId,
      user: { _id: user._id },
      content: messageContent,
      time: new Date(),
    };

    setMessageContent("");
    messageTextFieldRef.current?.focus();

    stompClient.send(
      `/app/classes/${params.classId}/messenger`,
      {},
      JSON.stringify(newMesasge)
    );
  };

  // overflow
  const wrapperRef = useRef(null);

  const [wrapperHeight, setWrapperHeight] = useState(0);

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;

    const wrapperHeight =
      document.body.offsetHeight -
      wrapperRef.current.getBoundingClientRect().top;

    const scroll =
      wrapperRef.current.scrollHeight - wrapperRef.current.offsetHeight;
    wrapperRef.current.scrollTop = scroll;

    setWrapperHeight(wrapperHeight - 15);

    return () => {};
  }, [messages.length]);

  return (
    <Fragment>
      {messages == "loading" ? (
        <div className="flex-1 flex items-center justify-center">
          <CustomCircularProgress />
        </div>
      ) : (
        <div
          className="flex flex-col overflow-y-scroll"
          ref={wrapperRef}
          style={{ height: wrapperHeight > 0 && `${wrapperHeight}px` }}
        >
          <header
            style={{ top: "-2px" }}
            className="sticky left-0 flex items-center bg-gray-100 p-4 text-red-500 font-medium"
          >
            <MailOutlined className="mr-2" /> Kênh chung
          </header>
          <div className="flex flex-col h-full">
            <div className="flex flex-col">
              {messages.length > 0 ? (
                <ul className="w-full border-r-2 p-4 flex flex-col justify-start">
                  {messages.map((message) => {
                    return (
                      <li
                        key={message._id}
                        title={dateFormat(message.time)}
                        className={`${
                          message.user._id == user._id &&
                          "self-end flex-row-reverse"
                        } mt-2 flex items-end overflow-x-scroll`}
                      >
                        <img
                          className="mt-1 object-cover h-8 w-8 rounded-full"
                          src={
                            message.user.profileImage
                              ? message.user.profileImage
                              : "/assets/images/profile_image.png"
                          }
                        />
                        <div className="">
                          <div
                            className={`${
                              message.user._id == user._id ? "mr-2" : "ml-2"
                            } text-sm`}
                          >
                            {message.user.username}
                          </div>
                          <div
                            className={`border-2 border-gray-50 rounded-xl max-w-xs sm:max-w-sm md:max-w-lg p-2 text-gray-50 break-words ${
                              message.user._id == user._id
                                ? "mr-2 bg-pink-400"
                                : "ml-2 bg-sky-600"
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-gray-500 font-medium">
                  Chưa có tin nhắn nào
                </div>
              )}

              {/* send message */}
              <div className="sticky left-0 bottom-0 border-t-2 p-4 bg-gray-100 flex items-center">
                <img
                  className="mr-4 object-cover h-8 w-8 rounded-full"
                  src={
                    user.profileImage
                      ? user.profileImage
                      : "/assets/images/profile_image.png"
                  }
                />
                <TextField
                  variant="standard"
                  placeholder="Nhập tin nhắn"
                  fullWidth
                  multiline
                  maxRows={4}
                  inputRef={messageTextFieldRef}
                  value={messageContent}
                  onChange={(e) => {
                    setMessageContent(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (
                      (e.ctrlKey && e.key === "Enter") ||
                      (e.shiftKey && e.key === "Enter") ||
                      (e.altKey && e.key === "Enter")
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
                <IconButton
                  title="Gửi tin nhắn"
                  className="ml-4 group"
                  disabled={!messageContent.trim()}
                  onClick={() => {
                    handleSendMessage();
                  }}
                >
                  <SendOutlined className="group-hover:text-sky-400 duration-300" />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default General;
