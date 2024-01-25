"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faPlusSquare,
  faSignIn,
  faSignOut,
  faSquarePlus,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { Button, CircularProgress, Grid, Menu, MenuItem } from "@mui/material";
import {
  AccountCircleOutlined,
  AutoModeOutlined,
  DriveFileMoveOutlined,
  GridOnOutlined,
  GroupOutlined,
  LogoutOutlined,
  SchoolOutlined,
  TextSnippetOutlined,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "@/lib/redux/action/user";
import { instance } from "@/app/utils/axios";

const drawerWidth = 180;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

function RootLayout({ children }) {
  const navbarMenu = [
    // { type: "link", title: "Trang chủ", icon: <HomeOutlined />, href: "/home" },
    {
      type: "link",
      title: "Tệp của tôi",
      icon: <DriveFileMoveOutlined />,
      href: "/file-explore/home",
    },
    { type: "devider" },

    {
      type: "link",
      title: "K-Word",
      icon: <TextSnippetOutlined />,
      href: "/k-word/home",
    },
    {
      type: "link",
      title: "K-Sheet",
      icon: <GridOnOutlined />,
      href: "/k-sheet/home",
    },
    {
      type: "link",
      title: "K-Learning",
      icon: <SchoolOutlined />,
      href: "/k-learning",
    },
    { type: "devider" },
    {
      type: "link",
      title: "Tài khoản",
      icon: <AccountCircleOutlined />,
      href: "/account",
    },
    { type: "devider" },
  ];

  const router = useRouter();

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const pathName = usePathname();
  const currentPath = pathName.split("/")[1];

  const handleGetUserData = () => {
    const jwtToken = localStorage.getItem("jwtToken");
    const username = localStorage.getItem("username");

    const config = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    instance
      .get(`/users/username=${username}`, config)
      .then((res) => {
        const user = res.data;
        dispatch(login(user));
        setIsPageLoaded(true);
      })
      .catch(() => {
        setIsPageLoaded(true);
      });
  };

  const handleLogOut = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    dispatch(logout());
    router.push("/login");
  };

  // mui
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  useEffect(() => {
    if (Object.keys(user).length == 0 && isPageLoaded) {
      router.push("/login");
    }
  }, [isPageLoaded]);

  useEffect(() => {
    handleGetUserData();
  }, []);

  return (
    <Fragment>
      {Object.keys(user).length > 0 ? (
        <Box sx={{ display: "flex", height: "100%" }}>
          {/* Header */}
          <AppBar position="fixed" open={drawerOpen} color="inherit">
            <Toolbar className="pr-0 sm:pt-3 sm:pb-3 md:pt-1 md:pb-1">
              <IconButton
                color="default"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  ...(drawerOpen && { display: "none" }),
                }}
                className="mr-1 sm:mr-3"
              >
                <MenuIcon />
              </IconButton>
              <header className="w-full h-full flex justify-between items-center sm:pl-3 sm:pr-3 md:pl-5 md:pr-5">
                <Link
                  href={"/file-explore/home"}
                  className="font-bold text-sky-600 text-sm md:text-2xl sm:text-xl sm:p-1 rounded-xl border-b-2 border-t-2 border-sky-500"
                >
                  K-OFFICE
                </Link>
                <div className="flex items-center">
                  <Grid container>
                    <Grid
                      item
                      marginLeft={2}
                      className="hidden sm:flex items-center"
                    >
                      <Button variant="outlined">
                        <Link
                          className="flex items-center justify-center [&>*]:text-sky-600"
                          href={"/file-explore/home"}
                        >
                          <FontAwesomeIcon
                            icon={faFile}
                            height={15}
                            width={15}
                          />
                          <div className="ml-2">Quản lý tài nguyên</div>
                        </Link>
                      </Button>
                    </Grid>
                    <Grid item marginLeft={2}>
                      {/* user avatar */}
                      {!!user ? (
                        <div className="flex items-center">
                          <Link
                            href={"/account"}
                            className="flex items-center border-2 border-slate-200 rounded-md sm:p-2 sm:mr-2"
                          >
                            <span className="font-medium text-slate-500 text-sm sm:text-base mr-2 ">
                              {user.username}
                            </span>
                            <div
                              id="demo-positioned-button"
                              className="rounded-full cursor-pointer border-2 border-sky-400 w-9 h-9 overflow-hidden"
                              aria-controls={
                                open ? "demo-positioned-menu" : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={open ? "true" : undefined}
                              // onClick={handleClick}
                            >
                              <img
                                className="w-full h-full object-cover"
                                src={
                                  user.profileImage
                                    ? user.profileImage
                                    : "/assets/images/profile_image.png"
                                }
                              />
                            </div>
                          </Link>
                          <IconButton onClick={handleLogOut}>
                            <LogoutOutlined className="text-orange-500" />
                          </IconButton>
                        </div>
                      ) : (
                        <Link href={"/login"}>
                          <Button variant="contained" color="info">
                            <FontAwesomeIcon icon={faSignIn} />
                            <div className=" ml-2 text-white">Đăng nhập</div>
                          </Button>
                        </Link>
                      )}
                    </Grid>
                  </Grid>
                </div>
              </header>
            </Toolbar>
          </AppBar>

          {/* Sidebar */}
          <Drawer variant="permanent" open={drawerOpen}>
            <DrawerHeader>
              <div className="w-full text-left font-bold">Danh mục</div>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            {/* navlink */}
            <List>
              {navbarMenu.map((item, index) => {
                return item.type === "link" ? (
                  <Link
                    key={`navbar-item-${index}`}
                    href={item.href}
                    title={item.title}
                  >
                    <ListItem disablePadding sx={{ display: "block" }}>
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: drawerOpen ? "initial" : "center",
                          px: 2.5,
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: drawerOpen ? 3 : "auto",
                            justifyContent: "center",
                          }}
                          className={
                            item.href.split("/")[1] === currentPath
                              ? " [&>*]:text-sky-500"
                              : null
                          }
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <span
                              className={`font-bold ${
                                item.href.split("/")[1] === currentPath
                                  ? "text-sky-500"
                                  : null
                              }`}
                            >
                              {item.title}
                            </span>
                          }
                          sx={{ opacity: drawerOpen ? 1 : 0 }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Link>
                ) : (
                  <Divider key={`navbar-item-${index}`} />
                );
              })}
            </List>
          </Drawer>

          {/* Main */}
          <div className=" w-full mt-16  sm:p-2 sm:mt-20 overflow-x-hidden">
            {children}
          </div>
        </Box>
      ) : (
        <div className="w-ful h-full flex items-center justify-center">
          <CircularProgress className="animate-spin text-sky-500" />
        </div>
      )}
    </Fragment>
  );
}

export default RootLayout;
