import ReactPlayer, { ReactPlayerProps } from "react-player";

function Player({ url, playerRef, ...props }: any) {
  return (
    <ReactPlayer
      url={url}
      ref={playerRef}
      {...props}
      playing
      controls
      width={"50%"}
      height={600}
    />
  );
}

export default Player;
