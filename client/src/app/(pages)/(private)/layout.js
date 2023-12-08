"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

import { Button, Grid, Menu, MenuItem } from "@mui/material";
import {
  DriveFileMoveOutlined,
  GridOnOutlined,
  GroupOutlined,
  HomeOutlined,
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

const navbarMenu = [
  { type: "link", title: "Trang chủ", icon: <HomeOutlined />, href: "/home" },
  {
    type: "link",
    title: "Tệp của tôi",
    icon: <DriveFileMoveOutlined />,
    href: "/file-explore/home",
  },
  { type: "devider" },
  {
    type: "link",
    title: "K-Meeting",
    icon: <GroupOutlined />,
    href: "/k-meeting",
  },
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
  { type: "devider" },
];

function RootLayout({ children }) {
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
      .catch((err) => {
        setIsPageLoaded(true);
      });
  };

  const handleLogOut = () => {
    localStorage.removeItem("jwtToken");
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
    <Box sx={{ display: "flex", height: "100%" }}>
      {/* Header */}
      <AppBar position="fixed" open={drawerOpen} color="inherit">
        <Toolbar>
          <IconButton
            color="default"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(drawerOpen && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <header className="w-full h-full pl-5 pr-5 flex justify-between items-center ">
            <Link href={"/"} className="font-bold text-slate-500 text-2xl">
              K-EDITOR
            </Link>
            <div className="flex items-center">
              <Grid container>
                <Grid children>
                  <Button variant="outlined" color="success">
                    <Link
                      className="flex items-center justify-center [&>*]:text-green-800"
                      href={"/word-editor"}
                    >
                      <FontAwesomeIcon
                        icon={faSquarePlus}
                        height={15}
                        width={15}
                      />
                      <div className="ml-2 ">Tạo tệp mới</div>
                    </Link>
                  </Button>
                </Grid>
                <Grid children marginLeft={2}>
                  <Button variant="outlined">
                    <Link
                      className="flex items-center justify-center [&>*]:text-sky-600"
                      href={"/myfile"}
                    >
                      <FontAwesomeIcon icon={faFile} height={15} width={15} />
                      <div className="ml-2">Tệp của tôi</div>
                    </Link>
                  </Button>
                </Grid>
                <Grid children marginLeft={2}>
                  {/* Dropdown user avatar */}
                  {!!user ? (
                    <div className="">
                      <div
                        id="demo-positioned-button"
                        className="rounded-full cursor-pointer border-2 border-sky-400"
                        aria-controls={
                          open ? "demo-positioned-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                      >
                        <img
                          className="w-9 h-9 rounded-full object-cover"
                          src={"/assets/images/profile_image.png"}
                        />
                      </div>
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
                        <MenuItem onClick={handleClose}>
                          <Link
                            className="flex items-center [&>*]:text-sky-900"
                            href={"/profile"}
                          >
                            <FontAwesomeIcon icon={faUser} />
                            <div className="ml-4">{`Tài khoản - ${user.username}`}</div>
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <Link
                            className="flex items-center [&>*]:text-sky-900"
                            href={"/profile"}
                          >
                            <FontAwesomeIcon icon={faPlusSquare} />
                            <div className="ml-4">Tạo tệp mới</div>
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <Link
                            className="flex items-center [&>*]:text-sky-900"
                            href={"/profile"}
                          >
                            <FontAwesomeIcon icon={faFile} />
                            <div className="ml-4">Tệp của tôi</div>
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <div
                            className="flex items-center [&>*]:text-sky-900 cursor-pointer"
                            href={"/profile"}
                            onClick={handleLogOut}
                          >
                            <FontAwesomeIcon icon={faSignOut} />
                            <div className="ml-4">Đăng xuất</div>
                          </div>
                        </MenuItem>
                      </Menu>
                    </div>
                  ) : (
                    <Link href={"/sign-in"}>
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
          <div className="w-full pl-4 text-left font-bold">Danh mục</div>
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
                          ? "text-sky-500"
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
      <Box
        component="main"
        sx={{ flexGrow: 1, flex: 1, overflowX: "hidden" }}
        marginTop={8}
        padding={2}
      >
        {children}
      </Box>
    </Box>
  );
}

export default RootLayout;
