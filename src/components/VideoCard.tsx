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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import defaultThumbnail from "../assets/images/thumbnail_default.jpg";
import { CONTENT_SERVICE_URL } from "../../env.config";
import formattedDate from "../utils/formatDate";
import { Video } from "../interfaces";
import { green } from "@mui/material/colors";

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
            <Stack spacing={2} direction={"row"} alignItems={"center"}>
              <Typography variant="h4" sx={{ textTransform: "capitalize" }}>
                {props.title}
              </Typography>
              {props.transcodeDone && (
                <CheckCircleIcon
                  style={{ color: green[400], fontSize: "2rem" }}
                />
              )}
            </Stack>

            <Typography variant="subtitle2">
              {formattedDate(props.createdAt)}
            </Typography>
            <Typography variant="subtitle1">{props.description}</Typography>
          </Stack>
        </ListItemText>
      </ListItemButtonWrapper>
      <Divider />
    </>
  );
}

export default VideoCard;
