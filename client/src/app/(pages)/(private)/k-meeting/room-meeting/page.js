"use client";

import { useState, useEffect } from "react";
import {
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Button,
  Grid,
} from "@mui/material";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const RoomMeeting = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);

    client.connect({}, () => {
      client.subscribe("/room/chat", (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prevMessages) => {
          return [...prevMessages, receivedMessage];
        });
      });
    });

    setStompClient(client);

    return () => {
      client.connected && client.disconnect();
    };
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const chatMessage = {
        nickname,
        content: message,
      };

      stompClient.send("/room/chat", {}, JSON.stringify(chatMessage));
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between w-full h-12 shadow-sm">
        <div className="flex items-center">ID:27363</div>
        <div className="flex">
          {isAdmin && (
            <div>
              <Button variant="outlined">Xem thành viên</Button>
              <Button variant="outlined" color="error">
                Kết thúc cuộc họp
              </Button>
            </div>
          )}
          <Button>Tài liệu</Button>
        </div>
      </div>
      <div className="overflow-y-scroll w-full flex-1"></div>
      <div className="flex items-center">
        <div className=" w-12 h-12 border-2 border-sky-400 rounded-full flex item-center justify-center">
          <img
            className="w-full h-full rounded-full object-cover"
            src="https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-6/358408430_3416006722000116_7610469478774438934_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_aid=0&_nc_ohc=6CYWJWwUE00AX-T5FHD&_nc_ht=scontent.fhan14-1.fna&oh=00_AfDZMjnr74Sz3cXXv065mRH7lkpo-Mp2O3YMSz4YkxLs3g&oe=6554BFDE"
          />
        </div>
        <Box marginLeft={2} marginRight={2} height={"full"} sx={{ flex: "1" }}>
          <TextField fullWidth placeholder="Nhập tin nhắn" />
        </Box>

        <Button sx={{ marginRight: "12px" }}>
          <span className="mr-3 text-sky-500">Ghi âm</span>
          <FontAwesomeIcon icon={faMicrophone} />
        </Button>

        <Button
          onClick={() => {
            handleSendMessage();
          }}
        >
          <span className="mr-3 text-sky-500">Gửi</span>
          <FontAwesomeIcon icon={faPaperPlane} />
        </Button>
      </div>
    </div>
  );
};

export default RoomMeeting;
