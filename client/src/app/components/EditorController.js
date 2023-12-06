"use client";

import "regenerator-runtime/runtime";

import { useState, useEffect, useRef, Fragment } from "react";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { Box, Button, Menu, MenuItem } from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faFileDownload,
  faMicrophone,
  faPause,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { Textarea } from "@mui/joy";

import HeadlessTippy from "@tippyjs/react/headless";

function EditorController({ handleSaveFile }) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [isTranscriptVisible, setIsTranscriptVisible] = useState(false);

  const handleStartListening = () => {
    SpeechRecognition.startListening({ continuous: true });
    setIsTranscriptVisible(true);
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleCloseTranscript = () => {
    resetTranscript();
    handleStopListening();
    setIsTranscriptVisible(false);
  };

  // check micro
  // if (!browserSupportsSpeechRecognition) {
  //   console.log("Browser does not support speech recognition.");
  // }

  // Download collapse
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div className="flex">
        <div id="download-container">
          <Button
            id="demo-positioned-button"
            className="flex items-center"
            aria-controls={open ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            variant="outlined"
            color="primary"
            onClick={handleClick}
          >
            <FontAwesomeIcon icon={faFileDownload} />
            <div className="ml-2 text-sky-600">Tải xuống</div>
          </Button>
          {/* Save file */}
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem
              onClick={() => {
                handleSaveFile("Docx");
                setAnchorEl(null);
              }}
            >
              Tải xuống dưới dạng DOCX
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleSave("Txt");
                setAnchorEl(null);
              }}
            >
              Tải xuống dưới dạng TXT
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleSave("Sfdt");
                setAnchorEl(null);
              }}
            >
              Tải xuống dưới dạng SFDT
            </MenuItem>
          </Menu>
        </div>
        <HeadlessTippy
          visible={isTranscriptVisible}
          interactive
          placement="bottom"
          render={() => (
            <Box
              marginLeft={2}
              border={1}
              borderColor="skyblue"
              borderRadius={2}
              overflow="hidden"
              sx={{
                display: "flex",
                backgroundColor: "white",
              }}
            >
              <Textarea
                minRows={5}
                maxRows={9}
                variant="outline"
                color="Primary"
                size="lg"
                value={transcript}
                disabled
              />
              <div className="flex flex-col p-2">
                <HeadlessTippy
                  render={() => (
                    <span className="flex p-2 text-sm shadow-sm shadow-slate-400 rounded-lg bg-slate-300">
                      Xóa bản ghi âm
                    </span>
                  )}
                >
                  <span
                    className="flex justify-center items-center p-2 rounded-full cursor-pointer duration-300 hover:bg-slate-200"
                    onClick={() => {
                      handleCloseTranscript();
                    }}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </span>
                </HeadlessTippy>
                <HeadlessTippy
                  render={() => (
                    <span className="flex p-2 text-sm shadow-sm shadow-slate-400 rounded-lg bg-slate-300">
                      Sao chép vào bộ nhớ tạm
                    </span>
                  )}
                  hideOnClick={false}
                >
                  <FontAwesomeIcon
                    icon={faCopy}
                    className="p-2 text-slate-500 cursor-pointer hover:text-sky-600 duration-300"
                    onClick={() => {
                      navigator.clipboard.writeText(transcript);
                    }}
                  />
                </HeadlessTippy>
              </div>
            </Box>
          )}
        >
          <div id="record-container" className="ml-3">
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                listening ? handleStopListening() : handleStartListening();
              }}
            >
              {listening ? (
                <Fragment>
                  <FontAwesomeIcon icon={faPause} />
                  <div className="text-purple-700 ml-2">Dừng ghi âm</div>
                </Fragment>
              ) : (
                <Fragment>
                  <FontAwesomeIcon icon={faMicrophone} />
                  <div className="text-purple-700 ml-2">
                    Chuyển giọng nói thành văn bản
                  </div>
                </Fragment>
              )}
            </Button>
          </div>
        </HeadlessTippy>
      </div>
    </div>
  );
}

export default EditorController;
