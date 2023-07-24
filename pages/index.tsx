import { useEffect, useState } from "react";
import { getAllVideos } from "../src/services";
import VideoCard from "../src/components/VideoCard";
import Link from "next/link";
import { Video } from "../src/interfaces";

export default function Home() {
  const [videos, setVideos] = useState<any>([]);

  useEffect(() => {
    const fetchVideosData = async () => {
      const data = await getAllVideos();
      setVideos(data);
    };
    fetchVideosData().catch(console.error);
  }, []);
  console.log(videos);

  return (
    <>
      <h1>HOME</h1>
      {videos.length &&
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
        })}
    </>
  );
}
