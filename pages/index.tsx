import { ChangeEvent, useEffect, useState } from "react";
import { getVideo } from "../src/services";
import VideoCard from "../src/components/VideoCard";
import Link from "next/link";
import { Video } from "../src/interfaces";
import { Pagination, Stack } from "@mui/material";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [videoParams, setVideoParams] = useState({
    pageSize: 5,
    pageNumber: 1,
  });

  useEffect(() => {
    const loadVideoByPagination = async () => {
      try {
        const { pageSize, pageNumber } = videoParams;
        const data = await getVideo(pageSize, pageNumber);
        // console.log(data);
        setVideos(data.records);
        setTotalPage(data.totalPages);
      } catch (error) {
        console.error(error);
      }
    };

    loadVideoByPagination();
  }, [videoParams]);
  // console.log(videos);

  const handlePageChange = async (
    event: ChangeEvent<unknown>,
    page: number
  ) => {
    setVideoParams({
      ...videoParams,
      pageNumber: page,
    });
  };

  return (
    <>
      <h1>HOME</h1>
      <Stack alignItems={"flex-end"}>
        <Pagination
          count={totalPage}
          variant="outlined"
          shape="rounded"
          onChange={(event, page) => handlePageChange(event, page)}
        />
        {videos &&
          videos.length &&
          videos.map((video: Video) => {
            return (
              <Link
                key={video.id}
                href={`/video/${video.id}`}
                style={{
                  width: "100%",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <VideoCard {...video} />
              </Link>
            );
          })}
      </Stack>
    </>
  );
}
