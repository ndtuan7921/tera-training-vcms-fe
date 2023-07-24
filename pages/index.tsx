import { useEffect, useState } from "react";
import { getAllVideos, uploadVTTFile } from "../src/services";
import VideoCard from "../src/components/VideoCard";
import Link from "next/link";
import { Video } from "../src/interfaces";
import CustomizedDialogs from "../src/components/FormDialog";
import { Button } from "@mui/material";
import * as webvtt from "node-webvtt";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);

  const [productAds, setProductAds] = useState<any>([]);

  useEffect(() => {
    const fetchVideosData = async () => {
      const data = await getAllVideos();
      setVideos(data);
    };
    fetchVideosData().catch(console.error);
  }, []);
  console.log(productAds);

  const handleSubmitVTTFile = async () => {
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

    const modifiedSubtitleFile = new File(
      [modifiedSubtitleContent],
      "subtitles.vtt"
    );

    // Create FormData to send the file
    const formData = new FormData();
    formData.append("subtitleFile", modifiedSubtitleFile);
    formData.append("videoId", "abcdefghijklmnopqrstuvwxyz");

    try {
      const res = await uploadVTTFile(formData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>HOME</h1>
      <CustomizedDialogs {...{ productAds, setProductAds }} />
      <Button variant="outlined" onClick={handleSubmitVTTFile}>
        Submit Vtt File
      </Button>
      {/* {videos &&
        videos.length &&
        videos.map((video: Video) => {
          return (
            <Link
              key={video.id}
              href={`/video/${video.id}`}
              style={{ width: "90%", textDecoration: "none", color: "inherit" }}
            >
              <VideoCard {...video} />
            </Link>
          );
        })} */}
    </>
  );
}
