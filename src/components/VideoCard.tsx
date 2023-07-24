import styled from "@emotion/styled";
import {
  Chip,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import DoneIcon from "@mui/icons-material/Done";
import defaultThumbnail from "../assets/images/thumbnail_default.jpg";
import { CONTENT_SERVICE_URL } from "../../env.config";
import formattedDate from "../utils/formatDate";
import { Video } from "../interfaces";

const ListItemButtonWrapper = styled(ListItemButton)(({ theme }) => ({
  columnGap: "3rem",
  width: "100%",
}));

interface VideoCardProps extends Video {}

function VideoCard(props: VideoCardProps) {
  const srcImage = props.thumbnailUrl
    ? CONTENT_SERVICE_URL + props.thumbnailUrl
    : defaultThumbnail;

  return (
    <>
      <ListItemButtonWrapper>
        <ListItemIcon
          sx={{
            position: "relative",
            borderRadius: "9px",
            width: "312px",
            height: "219px",
          }}
        >
          <Image src={srcImage} alt={"card-img"} fill objectFit="cover" />
        </ListItemIcon>
        <ListItemText>
          <Stack spacing={2}>
            {/* <Typography variant="subtitle2">Action | Drama</Typography> */}
            <Typography variant="h4" sx={{ textTransform: "capitalize" }}>
              {props.title}
            </Typography>
            <Typography variant="subtitle2">
              {formattedDate(props.createdAt)}
            </Typography>
            <Typography variant="subtitle1">{props.description}</Typography>
          </Stack>
          {props.transcodeDone && (
            <Chip
              sx={{ float: "right" }}
              deleteIcon={<DoneIcon />}
              label="transcoded"
              color="success"
              variant="outlined"
            />
          )}
        </ListItemText>
      </ListItemButtonWrapper>
      <Divider />
    </>
  );
}

export default VideoCard;
