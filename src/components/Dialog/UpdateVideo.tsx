import * as React from "react";
import * as webvtt from "node-webvtt";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  Stack,
  TextField,
  styled,
  Slider,
  Input,
} from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ImageUploader, ProductImageUploader } from "../Uploader";
import { updateVideo, uploadVTTFile } from "../../services";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export default function UpdateVideo(props: any) {
  console.log("props: ", props);
  const { videoId, title, description, thumbnail, handleUpdate } = props;

  const [formUpdate, setFormUpdate] = useState({
    title,
    description,
    thumbnail,
  });
  console.log(formUpdate);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [newThumbnail, setNewThumbnail] = useState<string>();
  console.log(newThumbnail);
  const handleOpen = () => {
    setIsOpen((state) => !state);
  };

  useEffect(() => {
    isSubmitted && setFormUpdate({ ...formUpdate, thumbnail: newThumbnail });
  }, [newThumbnail]);

  const handleSubmit = async () => {
    // console.log(formUpdate);
    try {
      const res = await updateVideo(videoId, formUpdate);
      console.log(res);
      alert("Updated video");
      setIsOpen(false);
      handleUpdate(true);
      setIsSubmitted((state) => !state);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Button
        variant="outlined"
        onClick={handleOpen}
        startIcon={<ShoppingBagOutlinedIcon />}
      >
        Update Video
      </Button>
      <BootstrapDialog
        onClose={handleOpen}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleOpen}>
          Update Video
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <InputLabel>Title</InputLabel>
              <TextField
                value={formUpdate.title}
                onChange={(e) =>
                  setFormUpdate({ ...formUpdate, title: e.target.value })
                }
                required
                fullWidth
                id="video-title"
                placeholder="Title"
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Description</InputLabel>
              <TextField
                value={formUpdate.description}
                onChange={(e) =>
                  setFormUpdate({ ...formUpdate, description: e.target.value })
                }
                required
                fullWidth
                id="video-description"
                placeholder="Description"
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Thumbnail</InputLabel>
              <ImageUploader
                handleThumbnail={setNewThumbnail}
                {...{ isSubmitted, setIsSubmitted }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit}>Update</Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
