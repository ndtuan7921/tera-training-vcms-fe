import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  getProductListByVTTFile,
  getResolutionList,
  getVTTFileByVideoId,
  getVideoById,
} from "../../../src/services";

import SellIcon from "@mui/icons-material/Sell";
import { useRouter } from "next/router";
import { VideoDetail } from "../../../src/interfaces";
import parseMasterPlaylist from "../../../src/utils/parseMaterPlaylist";
import { CONTENT_SERVICE_URL, VTT_SERVICE_URL } from "../../../env.config";
import ReactPlayer from "react-player";
const Player = dynamic(() => import("../../../src/components/Player"), {
  ssr: false,
});
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import FormDialog from "../../../src/components/FormDialog";

function VideoPage() {
  const router = useRouter();
  const playerRef = useRef<any>();
  const [video, setVideo] = useState<VideoDetail>();
  const [url, setUrl] = useState("");
  const [masterPlaylist, setMasterPlaylist] = useState<any>(null);
  const [selectedResolution, setSelectedResolution] = useState<any>(null);
  const [vttFile, setVttFile] = useState<any>(null);
  const [vttData, setVttData] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(0);

  //    fetch video data
  useEffect(() => {
    const fetchVideoData = async () => {
      const videoId = router.query.id as string;
      const data = await getVideoById(videoId);
      setVideo(data);
      setUrl(
        data.transcodeDone
          ? `${CONTENT_SERVICE_URL + data.manifestUrl}`
          : `${CONTENT_SERVICE_URL + data.videoUrl}`
      );
    };
    router.isReady && router.query.id && fetchVideoData();
  }, [router.isReady, router.query.id]);

  //    fetch video resolutions
  useEffect(() => {
    const fetchVideoResolutions = async () => {
      const data = await getResolutionList(url);
      setMasterPlaylist(parseMasterPlaylist(data));
      setSelectedResolution(parseMasterPlaylist(data)[0]);
    };
    url && fetchVideoResolutions();
  }, [video, url]);

  //    fetch VTT file
  useEffect(() => {
    const loadVTTFile = async () => {
      const videoId = router.query.id as string;
      const data = await getVTTFileByVideoId(videoId);
      setVttFile(VTT_SERVICE_URL + data.vttUrl);
    };
    router.query.id && loadVTTFile();
  }, [router.isReady, router.query.id]);

  //    fetch VTT data
  useEffect(() => {
    const loadVTTData = async () => {
      const data = await getProductListByVTTFile(vttFile);
      setVttData(data);
    };
    vttFile && loadVTTData();
  }, [vttFile]);

  const config = useMemo(() => {
    return {
      file: {
        attributes: {
          crossOrigin: "anonymous",
        },
        tracks: [
          {
            kind: "subtitles",
            src: vttFile,
            default: true,
            mode: "showing",
          },
        ],
      },
    };
  }, [vttFile]);

  const baseURL = `${CONTENT_SERVICE_URL}/manifest/${video?.fileName.replace(
    ".mp4",
    ""
  )}/`;

  const handleResolutionChange = (resolution: any) => {
    setSelectedResolution(resolution);
    playerRef.current.getCurrentTime() &&
      setCurrentTime(playerRef.current.getCurrentTime());
  };

  return (
    <Box>
      {video && (
        <>
          <Box>
            <Player
              key={vttFile}
              playing
              url={
                selectedResolution && selectedResolution.uri
                  ? baseURL + selectedResolution.uri
                  : url
              }
              playerRef={playerRef}
              onStart={() => playerRef.current?.seekTo(currentTime)}
              config={config}
            />
            <Stack direction={"row"} spacing={2} my={4}>
              {/* Quality of video */}
              <FormControl sx={{ minWidth: 120 }} size="small">
                <InputLabel id="video-quality">Quality</InputLabel>
                <Select
                  labelId="video-quality"
                  id="video-quality"
                  value={
                    selectedResolution ? selectedResolution.resolution : ""
                  }
                  label="Quality"
                >
                  {masterPlaylist &&
                    masterPlaylist.map((item: any) => (
                      <MenuItem
                        key={item.uri}
                        onClick={() => handleResolutionChange(item)}
                        disabled={item.uri === selectedResolution.uri}
                        value={item.resolution}
                      >
                        {item.resolution}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              {/* handle VTT file */}
              {/* <Button
                variant="outlined"
                startIcon={<InsertDriveFileIcon />}
                onClick={() => setIsOpen((state) => !state)}
              >
                VTT File
              </Button> */}
              <FormDialog />

              {/* handle products */}
              <Button
                color="secondary"
                variant="outlined"
                startIcon={<SellIcon />}
              >
                Products
              </Button>
            </Stack>
          </Box>

          <Stack spacing={2} my={2}>
            <Typography variant="h4" sx={{ textTransform: "capitalize" }}>
              {video.title}
            </Typography>
            <Typography variant="h6">{video.description}</Typography>
          </Stack>
        </>
      )}
    </Box>
  );
}

export default VideoPage;
