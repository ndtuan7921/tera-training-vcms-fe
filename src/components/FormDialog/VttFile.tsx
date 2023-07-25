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
import { useEffect, useRef, useState } from "react";
import { ProductImageUploader } from "../Uploader";
import { uploadVTTFile } from "../../services";

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

export default function CustomizedDialogs(props: any) {
  const { productAds, setProductAds, videoId, setIsVTTSubmited } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imgURL, setImgURL] = useState("");
  const [startTime, setStartTime] = useState<any>(0);
  const [endTime, setEndTime] = useState<any>(0);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const desRef = useRef<HTMLInputElement | null>(null);
  const priceRef = useRef<HTMLInputElement | null>(null);

  // useEffect(() => {
  //   // console.log(productAds);
  //   handleVTTFile();
  // }, [productAds]);

  const handleOpen = () => {
    setIsOpen((state) => !state);
  };

  const handleStartTimeChange = (event: Event, newValue: number | number[]) => {
    setStartTime(newValue);
  };
  const handleEndTimeChange = (event: Event, newValue: number | number[]) => {
    setEndTime(newValue);
  };

  const handleAddNew = () => {
    const name = nameRef.current?.value;
    const description = desRef.current?.value;
    const price = priceRef.current?.value;
    const newProduct = {
      startTime,
      endTime,
      name,
      description,
      price,
      imgURL,
    };
    setProductAds([...productAds, newProduct]);

    // reset form
    setIsSubmitted((state) => !state);
    nameRef.current!.value = "";
    desRef.current!.value = "";
    priceRef.current!.value = "";
    setStartTime(0);
    setEndTime(0);
  };

  const handleSubmit = async () => {
    const parsedSubtitle = {
      cues: [],
      valid: true,
    };

    productAds.forEach((subtitle: any, index: any) => {
      const cue = {
        identifier: (index + 1).toString(),
        start: subtitle.startTime,
        end: subtitle.endTime,
        text: `${subtitle.name}\n${subtitle.description}\n${subtitle.price}\n${subtitle.imgURL}`,
        styles: "",
      };
      parsedSubtitle.cues.push(cue as never);
    });

    const modifiedSubtitleContent = (webvtt as any).compile(parsedSubtitle);

    console.log(modifiedSubtitleContent);

    const modifiedSubtitleFile = new File(
      [modifiedSubtitleContent],
      "subtitles.vtt"
    );

    // Create FormData to send the file
    const formData = new FormData();
    formData.append("subtitleFile", modifiedSubtitleFile);
    formData.append("videoId", videoId);

    try {
      const res = await uploadVTTFile(formData);
      res!.ok && alert("fine");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Products
      </Button>
      <BootstrapDialog
        onClose={handleOpen}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleOpen}>
          Add new product
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={3}>
                <Grid item xs={12}>
                  <InputLabel>Start Time</InputLabel>
                  <Stack direction={"row"} spacing={3}>
                    <Slider
                      value={startTime}
                      onChange={handleStartTimeChange}
                    />
                    <Input value={startTime} size="small" />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>End Time</InputLabel>
                  <Stack direction={"row"} spacing={3}>
                    <Slider value={endTime} onChange={handleEndTimeChange} />
                    <Input value={endTime} size="small" />
                  </Stack>
                </Grid>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="product-name">Name</InputLabel>
                <TextField
                  required
                  fullWidth
                  inputRef={nameRef}
                  id="product-name"
                  placeholder="Enter Product Name"
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="product-description">
                  Description
                </InputLabel>
                <TextField
                  fullWidth
                  inputRef={desRef}
                  id="product-description"
                  placeholder="Description"
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="product-price">Sell Price</InputLabel>
                <TextField
                  required
                  fullWidth
                  inputRef={priceRef}
                  id="product-price"
                  placeholder="Price"
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="product-img">Product image</InputLabel>
                <ProductImageUploader
                  {...{ isSubmitted, setIsSubmitted }}
                  handleProductImage={setImgURL}
                />
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddNew}>Add new product</Button>
          <Button onClick={handleSubmit}>Submit VTT File</Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
