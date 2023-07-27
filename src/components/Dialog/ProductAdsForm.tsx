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
import { ImageUploader, ProductImageUploader } from "../Uploader";
import { uploadVTTFile } from "../../services";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { formatTime } from "../../utils/formatTime";

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

export default function ProductAdsForm(props: any) {
  const { productAds, setProductAds, videoId, setIsVTTSubmited, duration } =
    props;
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imgURL, setImgURL] = useState("");
  const [startTime, setStartTime] = useState<any>(0);
  const [endTime, setEndTime] = useState<any>(0);
  const [productList, setProductList] = useState<any>([]);
  const [product, setProduct] = useState<any>({
    startTime: 0,
    endTime: 0,
    name: "",
    description: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    imgURL != "" && setProduct({ ...product, image: imgURL });
  }, [imgURL]);

  // const nameRef = useRef<HTMLInputElement | null>(null);
  // const desRef = useRef<HTMLInputElement | null>(null);
  // const priceRef = useRef<HTMLInputElement | null>(null);

  const handleOpen = () => {
    setIsOpen((state) => !state);
  };

  // const handleStartTimeChange = (event: Event, newValue: number | number[]) => {
  //   setStartTime(newValue);
  // };
  // const handleEndTimeChange = (event: Event, newValue: number | number[]) => {
  //   setEndTime(newValue);
  // };

  // const handleAddNew = () => {
  //   const name = nameRef.current?.value;
  //   const description = desRef.current?.value;
  //   const price = priceRef.current?.value;

  //   if (!name || !description || !price || startTime > endTime) return;

  //   const newProduct = {
  //     startTime,
  //     endTime,
  //     name,
  //     description,
  //     price,
  //     imgURL,
  //   };
  //   setProductList([...productList, newProduct]);
  //   alert("Product added!");
  // };

  const handleSubmit = async () => {
    // console.log(productList);
    productAds.push(product);
    // if (!name || !description || !price || startTime > endTime) return;

    // const newProduct = {
    //   startTime,
    //   endTime,
    //   name,
    //   description,
    //   price,
    //   imgURL,
    // };

    // setProductList([...productList, newProduct]);

    const parsedSubtitle = {
      cues: [],
      valid: true,
    };

    productAds.forEach((subtitle: any, index: any) => {
      const cue = {
        identifier: (index + 1).toString(),
        start: subtitle.startTime,
        end: subtitle.endTime,
        text: `${subtitle.name}\n${subtitle.description}\n${subtitle.price}\n${subtitle.image}`,
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
      console.log(res);
      if (res!.ok) {
        alert("Submit File sucessfully");
        setIsVTTSubmited(true);

        // reset form
        setProduct({
          startTime: 0,
          endTime: 0,
          name: "",
          description: "",
          price: "",
          image: "",
        });
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleOpen}
        startIcon={<ShoppingBagOutlinedIcon />}
      >
        Add Product
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
                      value={product.startTime}
                      // onChange={handleStartTimeChange}
                      onChange={(e, value) =>
                        setProduct({ ...product, startTime: value })
                      }
                      max={duration}
                    />
                    <Input value={formatTime(product.startTime)} size="small" />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel>End Time</InputLabel>
                  <Stack direction={"row"} spacing={3}>
                    <Slider
                      value={product.endTime}
                      // onChange={handleEndTimeChange}
                      onChange={(e, value) =>
                        setProduct({ ...product, endTime: value })
                      }
                      max={duration}
                    />
                    <Input value={formatTime(product.endTime)} size="small" />
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
                  // inputRef={nameRef}
                  value={product.name}
                  onChange={(e) =>
                    setProduct({ ...product, name: e.target.value })
                  }
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
                  // inputRef={desRef}
                  value={product.description}
                  onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                  }
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
                  // inputRef={priceRef}
                  value={product.price}
                  onChange={(e) =>
                    setProduct({ ...product, price: e.target.value })
                  }
                  id="product-price"
                  placeholder="Price"
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1.25}>
                <InputLabel htmlFor="product-img">Product image</InputLabel>
                <ImageUploader
                  type="vtt_image"
                  handleImage={setImgURL}
                  isFormSubmited={isSubmitted}
                />
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleAddNew}>Add new product</Button> */}
          <Button onClick={handleSubmit}>Add to VTT File</Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
