"use client";

import { useEffect, useRef, useState } from "react";

import { Peer } from "peerjs";

import { over } from "stompjs";
import SockJS from "sockjs-client";

import { Button, Switch, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { VideocamOffOutlined, VideocamOutlined } from "@mui/icons-material";

function Test() {
  const user = useSelector((state) => state.user);

  // video ref
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);

  const [isCameraOn, setIsCameraOn] = useState(false);

  const [convMembers, setConvMembers] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [peerId, setPeerId] = useState(null);

  const peerIns = useRef(null);

  const handleTurnOnCamera = () => {
    if (!localVideoRef.current) return;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
      });
  };

  useEffect(() => {
    if (isCameraOn) {
      handleTurnOnCamera();
    }

    return () => {};
  }, [isCameraOn]);

  // create peer
  useEffect(() => {
    if (peerIns.current) return;

    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          call.answer(mediaStream);
          call.on("stream", (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
            console.log(remoteStream);
          });
        });
    });

    peerIns.current = peer;

    return () => {};
  }, []);

  useEffect(() => {
    if (!peerId || stompClient) return;

    return () => {};
  }, [peerId]);

  const handleCall = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        convMembers.forEach((id) => {
          const call = peerIns.current.call(id, mediaStream);
          call.on("stream", (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
            console.log("remoteStream click", remoteStream);
          });
        });
      });
  };

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = over(socket);
    client.connect({}, () => {
      client.subscribe(`/conversations/123/users`, (res) => {
        const users = JSON.parse(res.body);
        if (users.length > 0) {
          setConvMembers(users);
        }
      });

      setStompClient(client);
    });

    return () => {
      client.connected && client.disconnect();
    };
  }, []);

  useEffect(() => {
    if (convMembers.length > 0) {
      handleCall();
    }
  }, [convMembers.length]);

  const handleJoinConversation = (peerId) => {
    const newUser = {
      _id: user._id,
      username: user.username,
      profileImage: user.profileImage,
      peerId: peerId,
    };

    const jsonUser = JSON.stringify(newUser);

    stompClient.send(`/app/conversations/123/join`, {}, jsonUser);
  };

  return (
    <div className="w-full min-h-[calc(100%-84px)] flex items-center justify-center">
      {/* <div>{`Your ID: ${peerId}`}</div>

      <Button
        onClick={() => {
          handleJoinConversation(peerId);
        }}
      >
        Kết nối
      </Button>
      <div className="flex">
        <video ref={localVideoRef} autoPlay muted />
        <video ref={remoteVideoRef} autoPlay muted />
      </div> */}
      <video ref={remoteVideoRef} autoPlay muted />
      {peerId && (
        <div className="border-2 border-slate-200 rounded-lg p-4">
          <div className="w-full text-center">
            <h1>ID cuộc họp</h1>
            <h1>12345</h1>
          </div>
          <div className="">
            <div
              className={`mt-3 mb-3 overflow-hidden ${
                !isCameraOn && "p-3"
              } rounded-lg border-2 border-sky-200`}
            >
              {isCameraOn ? (
                <video ref={localVideoRef} autoPlay />
              ) : (
                <div className="text-slate-400">
                  <VideocamOffOutlined /> Camera của bạn đang tắt
                </div>
              )}
            </div>
            <div className="flex items-center justify-center">
              {isCameraOn ? (
                <VideocamOutlined className="text-sky-500" />
              ) : (
                <VideocamOffOutlined className="text-slate-500" />
              )}
              <Switch
                onChange={() => {
                  setIsCameraOn((prev) => !prev);
                }}
                color="info"
              />
            </div>
            <div className="w-full flex justify-center mt-3">
              <Button
                variant="outlined"
                style={{ minWidth: "178px" }}
                onClick={() => {
                  handleJoinConversation(peerId);
                }}
              >
                Bắt đầu buổi học
              </Button>
              <Button
                variant="outlined"
                style={{ minWidth: "178px" }}
                onClick={() => {
                  handleJoinConversation(peerId);
                }}
              >
                Tham gia buổi học
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Test;
