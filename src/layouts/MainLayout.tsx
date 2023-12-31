import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import teraLogo from "../assets/images/logo-black-wide-900-px.png";
import WebAssetIcon from "@mui/icons-material/WebAsset";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import React, { PropsWithChildren } from "react";
import Link from "next/link";
import Image from "next/image";
const drawerWidth = 240;
const sidebarItems = [
  {
    id: "all-videos",
    text: "All Videos",
    url: "/",
    icon: <WebAssetIcon />,
  },
  {
    id: "upload",
    text: "Upload",
    url: "/upload",
    icon: <UploadFileIcon />,
  },
];
function MainLayout({ children }: PropsWithChildren) {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: "white",
        }}
      >
        <Toolbar>
          <Typography variant="h5" sx={{ color: "#000" }}>
            Video CMS
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Image src={teraLogo} alt={"tera"} height={40} />
        </Toolbar>

        <Divider />
        <List>
          {sidebarItems.map((item) => (
            <Link
              href={item.url}
              key={item.id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              </div>
            </Link>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default MainLayout;
