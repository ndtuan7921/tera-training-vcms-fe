import ReactPlayer, { ReactPlayerProps } from "react-player";

function Player({ url, playerRef, ...props }: any) {
  return <ReactPlayer url={url} ref={playerRef} {...props} playing controls />;
}

export default Player;
