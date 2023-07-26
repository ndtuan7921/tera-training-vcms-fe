import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useRef, useState } from "react";
import { ImageUploader, VideoUploader } from "../src/components/Uploader";
import { uploadVideo } from "../src/services";
import { useRouter } from "next/router";

const FormfieldWrapper = styled(Box)(({ theme }) => ({
  margin: "8px 0",
}));

export default function Upload() {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);
  const [videoData, setVideoData] = useState<any>({});
  const [thumbnail, setThumbnail] = useState<string>();
  const [active, setActive] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;

    if (!title || !description) {
      console.error("Title and description are required");
      return;
    }

    const videoUploadData = {
      title,
      description,
      thumbnail,
      ...videoData,
    };

    try {
      const response = await uploadVideo(videoUploadData);
      // handle response
      // ...
      console.log(response);

      // Reset form values
      titleRef.current!.value = "";
      descriptionRef.current!.value = "";
      setIsSubmitted((state) => !state);
      setIsVideoUploaded(false);
      setVideoData({});

      alert("Video uploaded successfully!");

      router.replace("/");
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  return (
    <>
      <h1>UPLOAD</h1>
      <form onSubmit={handleSubmit}>
        <Stack
          spacing={4}
          direction="row"
          justifyContent="flex-start"
          divider={<Divider orientation="vertical" flexItem />}
        >
          {/* Video details */}
          <Box width={"20%"} display={"flex"} flexDirection={"column"}>
            <Typography variant="h6">Video Details</Typography>
            <FormfieldWrapper>
              <TextField
                id="outlined-basic"
                label="Title"
                variant="outlined"
                inputRef={titleRef}
                fullWidth
                required
              />
            </FormfieldWrapper>
            <FormfieldWrapper>
              <TextField
                id="outlined-basic"
                label="Description"
                variant="outlined"
                inputRef={descriptionRef}
                required
                fullWidth
              />
            </FormfieldWrapper>
            <Typography variant="h6">Thumbnail</Typography>

            {/* Thumbnail upload */}
            <ImageUploader
              isFormUploaded={isSubmitted}
              handleImage={setThumbnail}
            />
          </Box>

          {/* Video upload */}
          <FormfieldWrapper>
            <Typography variant="h6">Video Upload</Typography>
            <VideoUploader
              handleVideo={setVideoData}
              activeForm={active}
              setActiveForm={setActive}
            />
          </FormfieldWrapper>
        </Stack>
        <FormfieldWrapper>
          <Button type="submit" variant="contained" disabled={!active}>
            Upload
          </Button>
        </FormfieldWrapper>
      </form>
    </>
  );
}
