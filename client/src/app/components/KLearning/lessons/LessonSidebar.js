"use client";

import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";

import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import {
  AddOutlined,
  AnnouncementOutlined,
  BookmarkOutlined,
  ExpandLess,
  ExpandMore,
  MenuOutlined,
  OpenInFullOutlined,
  PlayLessonOutlined,
  QuizOutlined,
  RefreshOutlined,
} from "@mui/icons-material";

import SingleCreateForm from "../../SingleCreateForm";
import CustomSnackBar from "../../CustomSnackBar";

import { instance } from "@/app/utils/axios";
import getApiConfig from "@/app/utils/getApiConfig";
import { usePathname } from "next/navigation";

// drawer
const drawerWidth = 320;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

function LessonSidebar({ classData, handleReloadChapters }) {
  const user = useSelector((state) => state.user);

  const currentLesson = usePathname().split("/").pop();

  // ui
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const [createChapterFormData, setCreateChapterFormData] = useState({
    inputValue: "",
    isBtnSpinning: false,
    open: false,
  });

  const [snackBarData, setSnackBarData] = useState({
    content: "",
    open: false,
    severity: "",
  });

  const [chaptersOpen, setChaptersOpen] = useState([]);

  const handleToggleChapter = (index) => {
    setChaptersOpen((prev) => {
      const pos = prev.indexOf(index);
      if (pos >= 0) {
        prev.splice(pos, 1);
        return [...prev];
      } else {
        return [...prev, index];
      }
    });
  };

  // api
  const handleCreateChapter = () => {
    setCreateChapterFormData((prev) => ({ ...prev, isBtnSpinning: true }));

    const api = `classes/${classData._id}/create-chapter/name=${createChapterFormData.inputValue}`;

    instance
      .post(api, {}, getApiConfig())
      .then(() => {
        handleReloadChapters();
      })
      .then(() => {
        setSnackBarData((prev) => ({
          ...prev,
          content: "Tạo chương học mới thành công",
          open: true,
          severity: "success",
        }));
        setCreateChapterFormData((prev) => ({
          ...prev,
          inputValue: "",
          open: false,
        }));
      })
      .catch(() => {
        setSnackBarData((prev) => ({
          ...prev,
          content: "Tạo chương học mới thất bại",
          open: true,
          severity: "error",
        }));
      })
      .finally(() => {
        setCreateChapterFormData((prev) => ({ ...prev, isBtnSpinning: false }));
      });
  };

  return (
    <Fragment>
      <CustomSnackBar
        content={snackBarData.content}
        severity={snackBarData.severity}
        open={snackBarData.open}
        onCLose={() => {
          setSnackBarData((prev) => ({ ...prev, open: false }));
        }}
      />

      {drawerOpen ? (
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
            overflowX: "hidden",
          }}
          PaperProps={{
            style: {
              position: "static",
              height: "100%",
            },
          }}
          variant="permanent"
          anchor="right"
          open={false}
          className={`scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 ${
            drawerOpen ? "visible" : "hidden"
          }`}
        >
          <DrawerHeader className="pl-4 justify-between bg-sky-800">
            <span className="text-white font-semibold mr-2">Bài giảng</span>
            <div className="flex items-center">
              {classData.ownerId == user._id && (
                <IconButton
                  title="Tạo chương học mới"
                  onClick={() => {
                    setCreateChapterFormData((prev) => ({
                      ...prev,
                      open: true,
                    }));
                  }}
                  className="ml-2"
                >
                  <AddOutlined className="text-white" />
                </IconButton>
              )}
              <IconButton title="Làm mới" onClick={handleReloadChapters}>
                <RefreshOutlined className="text-white" />
              </IconButton>
              <IconButton title="Đóng" onClick={handleDrawerClose}>
                <ChevronRightIcon className="text-white" />
              </IconButton>
            </div>
          </DrawerHeader>

          <Divider />

          {classData.chapterList.length > 0 ? (
            <List className="overflow-x-hidden">
              {classData.chapterList.map((chapter, index) => {
                return (
                  <ListItem
                    key={`${classData._id}_${chapter}_${index}`}
                    disablePadding
                    className="flex flex-col items-start"
                  >
                    {/* render chapter */}
                    <ListItemButton
                      className={`w-full flex justify-between items-center pt-0 pb-0 hover:bg-sky-200 ${
                        chaptersOpen.indexOf(index) >= 0 && "bg-sky-200"
                      }`}
                      sx={{
                        border: "1px solid #f6f6f6",
                      }}
                    >
                      <div className="flex justify-start items-center flex-1 ">
                        <BookmarkOutlined className="mr-2 text-sky-600" />
                        <ListItemText
                          style={{ maxWidth: "155px" }}
                          className="truncate"
                          primary={
                            <span className="text-sky-700 truncate">{`${
                              index + 1
                            }. ${chapter.name}`}</span>
                          }
                          secondary={
                            <span className="flex items-center text-gray-400 text-sm">
                              {chapter.lessonList.length} bài học
                            </span>
                          }
                        />
                      </div>
                      <div className="flex items-center justify-end">
                        {classData.ownerId == user._id && (
                          <Link
                            href={{
                              pathname: `/k-learning/${chapter.classId}/lessons/create-lesson`,
                              query: {
                                // class_id: chapter.classId,
                                chapter_name: chapter.name,
                                chapter_id: chapter._id,
                              },
                            }}
                          >
                            <IconButton
                              title="Tạo bài giảng mới"
                              className="mr-1"
                            >
                              <AddOutlined />
                            </IconButton>
                          </Link>
                        )}
                        <IconButton
                          onClick={() => {
                            handleToggleChapter(index);
                          }}
                        >
                          {chaptersOpen.indexOf(index) >= 0 ? (
                            <ExpandLess className="text-slate-500" />
                          ) : (
                            <ExpandMore className="text-slate-500" />
                          )}
                        </IconButton>
                      </div>
                    </ListItemButton>

                    {/* render lesson */}
                    {chaptersOpen.indexOf(index) >= 0 &&
                      chapter?.lessonList.length > 0 && (
                        <List
                          className="w-full"
                          sx={{
                            pb: 0,
                            pt: 0,
                          }}
                          disablePadding
                        >
                          {chapter.lessonList.map((lesson, index) => {
                            return (
                              <ListItem
                                key={`lesson-${lesson._id}`}
                                sx={{ p: 0 }}
                                className={`${
                                  lesson._id == currentLesson && "bg-slate-200"
                                }`}
                              >
                                <Link
                                  href={{
                                    pathname: `/k-learning/${chapter.classId}/lessons/${lesson._id}`,
                                    query: {
                                      chapter_name: chapter.name,
                                    },
                                  }}
                                  className="w-full border-t-2 border-slate-100"
                                >
                                  <ListItemButton className="pl-6">
                                    {lesson.type == "video" ? (
                                      <PlayLessonOutlined
                                        className={`mr-2 ${
                                          lesson._id == currentLesson
                                            ? "animate-bounce text-orange-700"
                                            : "text-sky-300"
                                        }`}
                                      />
                                    ) : (
                                      <QuizOutlined
                                        className={`mr-2 text-sky-300 ${
                                          lesson._id == currentLesson &&
                                          "animate-bounce text-orange-700"
                                        }`}
                                      />
                                    )}
                                    <ListItemText
                                      primary={
                                        <span
                                          className={`font-semibold text-sm ${
                                            lesson._id == currentLesson
                                              ? "animate-bounce text-orange-700"
                                              : "text-sky-800"
                                          }`}
                                        >{`${index + 1}. ${lesson.name}`}</span>
                                      }
                                    />
                                  </ListItemButton>
                                </Link>
                              </ListItem>
                            );
                          })}
                        </List>
                      )}
                  </ListItem>
                );
              })}
            </List>
          ) : (
            !createChapterFormData.open && (
              <div className="mt-4 flex items-center justify-center font-semibold">
                <AnnouncementOutlined className="mr-2" /> Chưa có bài giảng nào
              </div>
            )
          )}
          <SingleCreateForm
            open={createChapterFormData.open}
            error={!createChapterFormData.inputValue.trim()}
            handleClose={() => {
              setCreateChapterFormData((prev) => ({
                ...prev,
                open: false,
                inputValue: "",
              }));
            }}
            handleOpen={() => {
              setCreateChapterFormData((prev) => ({ ...prev, open: true }));
            }}
            onInputChange={(value) => {
              setCreateChapterFormData((prev) => ({
                ...prev,
                inputValue: value,
              }));
            }}
            inputValue={createChapterFormData.inputValue}
            placeholder={"Nhập tên chương học mới"}
            isBtnSpinning={createChapterFormData.isBtnSpinning}
            handleSubmit={handleCreateChapter}
          />
        </Drawer>
      ) : (
        <div className="fixed bottom-4 right-5 bg-sky-700 rounded-full">
          <IconButton
            title="Mở rộng menu"
            // className="fixed top-0 right-0"
            onClick={() => {
              setDrawerOpen(true);
            }}
          >
            <OpenInFullOutlined className="text-white font-semibold" />
          </IconButton>
        </div>
      )}
    </Fragment>
  );
}

export default LessonSidebar;
