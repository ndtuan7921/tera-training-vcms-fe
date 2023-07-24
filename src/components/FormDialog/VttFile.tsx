import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Box,
  InputAdornment,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { ImageUploader } from "../Uploader";
import { useState } from "react";

export default function FormDialog() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen((pre) => !pre);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("tuan");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Button
        startIcon={<InsertDriveFileIcon />}
        variant="outlined"
        onClick={handleClickOpen}
      >
        VTT File
      </Button>
      <Dialog open={open} onClose={handleClickOpen}>
        <DialogTitle>VTT File Edit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <Stack direction={"row"} gap={1}>
            <TextField
              autoFocus
              margin="dense"
              id="start-time"
              label="Start Time"
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="end-time"
              label="End Time"
              type="text"
              fullWidth
            />
          </Stack>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Sell price"
            type="text"
          />
          <Box>
            <Typography variant="h6">Product image</Typography>
            <ImageUploader />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickOpen}>Cancel</Button>
          <Button type="submit">Update</Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
