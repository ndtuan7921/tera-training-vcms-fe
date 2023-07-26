import { useEffect, useMemo, useRef, useState } from "react";
import {
  getProductListByVTTFile,
  getResolutionList,
  getVTTFileByVideoId,
  getVideoById,
} from "../../../src/services";

import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import { useRouter } from "next/router";
import { Product, VideoDetail } from "../../../src/interfaces";
import parseMasterPlaylist from "../../../src/utils/parseMaterPlaylist";
import { CONTENT_SERVICE_URL, VTT_SERVICE_URL } from "../../../env.config";
const Player = dynamic(() => import("../../../src/components/Player"), {
  ssr: false,
});
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import ProductCard from "../../../src/components/ProductCard";
import Link from "next/link";
import { ConfirmDelete, ProductAdsForm } from "../../../src/components/Dialog";
import UpdateVideo from "../../../src/components/Dialog/UpdateVideo";

function VideoPage() {
  const router = useRouter();
  const playerRef = useRef<any>();
  const [video, setVideo] = useState<VideoDetail>();
  const [url, setUrl] = useState("");
  const [masterPlaylist, setMasterPlaylist] = useState<any>(null);
  const [selectedResolution, setSelectedResolution] = useState<any>(null);
  const [vttFile, setVttFile] = useState<any>(null);
  const [productAds, setProductAds] = useState<any>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVTTSubmited, setIsVTTSubmited] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [duration, setDuration] = useState(0);

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
  }, [router.isReady, router.query.id, isUpdated]);

  //    fetch video resolutions
  useEffect(() => {
    const fetchVideoResolutions = async () => {
      const data = await getResolutionList(url);
      data &&
        (setMasterPlaylist(parseMasterPlaylist(data)),
        setSelectedResolution(parseMasterPlaylist(data)[0]));
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
  }, [router.isReady, router.query.id, isVTTSubmited]);

  //    fetch VTT data
  useEffect(() => {
    const loadVTTData = async () => {
      const data = await getProductListByVTTFile(vttFile);
      setProductAds(data);
    };
    vttFile && loadVTTData();
  }, [vttFile, isVTTSubmited]);

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
  }, [vttFile, isVTTSubmited]);

  const baseURL = `${CONTENT_SERVICE_URL}/manifest/${video?.fileName.replace(
    ".mp4",
    ""
  )}/`;

  const handleResolutionChange = (resolution: any) => {
    setSelectedResolution(resolution);
    playerRef.current.getCurrentTime() &&
      setCurrentTime(playerRef.current.getCurrentTime());
  };

  console.log(isUpdated);

  return (
    <>
      <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
        <Stack spacing={1} direction={"row"} alignItems={"center"}>
          <ChevronLeftOutlinedIcon />
          <Typography variant="h6">Back</Typography>
        </Stack>
      </Link>
      {video && (
        <>
          <Stack
            spacing={4}
            my={4}
            direction={"row"}
            height={900}
            justifyContent={"space-between"}
          >
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
              onDuration={(duration: number) =>
                setDuration(Math.ceil(duration))
              }
            />
            {/* Product List */}
            <Stack spacing={2} my={4} sx={{ flex: "auto" }}>
              <Stack spacing={4} direction={"row"} mb={2}>
                <Typography variant="h6">Product List</Typography>
                {/* handle products & VTT File */}
                <ProductAdsForm
                  {...{ productAds, setProductAds, setIsVTTSubmited, duration }}
                  videoId={video && video.id}
                />
              </Stack>

              <Stack
                spacing={2}
                my={4}
                overflow={`${productAds.length > 0 && scroll}`}
                sx={{ overflowX: "hidden" }}
              >
                {productAds.length > 0 ? (
                  productAds.map((product: Product) => (
                    <div
                      key={product.imgURL}
                      onClick={() =>
                        playerRef.current?.seekTo(product.startTime)
                      }
                    >
                      <ProductCard {...product} />
                    </div>
                  ))
                ) : (
                  <Typography variant="body1">Not found</Typography>
                )}
              </Stack>
            </Stack>
          </Stack>

          {/* Controls */}
          <Stack direction={"row"} spacing={2} my={4}>
            {/* Quality of video */}
            {video.transcodeDone ? (
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
            ) : (
              <Typography variant="h6">Wait for transcoding</Typography>
            )}

            <ConfirmDelete videoId={video && video.id} />
            <UpdateVideo
              videoId={video.id}
              title={video.title}
              description={video.description}
              thumbnailUrl={video.thumbnailUrl}
              handleUpdate={setIsUpdated}
            />
          </Stack>

          {/* Video detail */}
          <Stack spacing={2} my={2} maxWidth={"70%"}>
            <Typography variant="h4" sx={{ textTransform: "capitalize" }}>
              {video.title}
            </Typography>
            <Typography variant="h6">{video.description}</Typography>
          </Stack>
        </>
      )}
    </>
  );
}

export default VideoPage;
