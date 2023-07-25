import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { deleteVideo } from "../../services";
import { useRouter } from "next/router";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function ConfirmDelete(props: any) {
  const { videoId } = props;
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen((state) => !state);
  };

  const handleDelete = async () => {
    try {
      const res = await deleteVideo(videoId);
      console.log(res);
      alert("Deleted video");
      router.push("/");
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="error"
        onClick={handleClickOpen}
        startIcon={<DeleteOutlineIcon />}
      >
        Delete video
      </Button>
      <Dialog open={open} onClose={handleClickOpen}>
        <DialogTitle>Delete Video</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this video?
          </DialogContentText>
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
