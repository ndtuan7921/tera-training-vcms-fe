import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { deleteVTTFile, deleteVideo } from "../../services";
import { useRouter } from "next/router";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LayersClearIcon from "@mui/icons-material/LayersClear";

const DELETE_OBJECT = [
  {
    type: "video",
    title: "Delete video",
    text: "Are you sure you want to delete this video?",
  },
  {
    type: "vtt",
    title: "Delete VTT File",
    text: "Are you sure you want to delete the video's vtt file?",
  },
];

export default function ConfirmDelete(props: any) {
  const { videoId, type } = props;
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const objDelete = DELETE_OBJECT.find((obj) => obj.type === type);
  // console.log(objDelete);

  const handleClickOpen = () => {
    setOpen((state) => !state);
  };

  const handleDelete = async () => {
    try {
      const res =
        objDelete?.type == "video"
          ? await deleteVideo(videoId)
          : await deleteVTTFile(videoId);
      console.log(res);
      alert(`Deleted ${objDelete?.type}`);
      // router.push("/");
    } catch (error) {
      console.error(`Error deleting ${objDelete?.type}`, error);
    }
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="error"
        onClick={handleClickOpen}
        startIcon={
          objDelete?.type == "video" ? (
            <DeleteOutlineIcon />
          ) : (
            <LayersClearIcon />
          )
        }
      >
        {objDelete?.title}
      </Button>
      <Dialog open={open} onClose={handleClickOpen}>
        <DialogTitle>{objDelete?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{objDelete?.text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickOpen}>Cancel</Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
