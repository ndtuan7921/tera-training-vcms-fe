import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import SendIcon from "@mui/icons-material/Send";
import { Product } from "../interfaces";
import { Box, CardActionArea, Stack } from "@mui/material";

interface ProductCardProps extends Product {}

export default function ProductCard(props: ProductCardProps) {
  return (
    // <Card sx={{ maxWidth: 300 }}>
    //   <CardActionArea>
    //     <CardMedia
    //       sx={{ height: 200, width: 220 }}
    //       component="img"
    //       image={props.imgURL}
    //     />
    //     <CardContent>
    //       <Typography gutterBottom variant="h6" component="div">
    //         {props.name}
    //       </Typography>
    //       <Typography gutterBottom variant="subtitle2" component="div">
    //         {props.price}
    //       </Typography>
    //       <Typography
    //         gutterBottom
    //         variant="body1"
    //         component="div"
    //         color={"error"}
    //       >
    //         Play to {props.startTime}
    //       </Typography>
    //     </CardContent>
    //   </CardActionArea>
    // </Card>
    <CardActionArea>
      <Card
        sx={{
          display: "flex",
          alignItem: "center",
          minWidth: 450,
          maxHeight: 135,
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: 151, height: 135 }}
          image={props.imgURL}
          alt="Live from space album cover"
        />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Stack spacing={1}>
              <Typography component="div" variant="h6">
                {props.name}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                {props.price}
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                component="div"
                sx={{ float: "left" }}
              >
                Play to seconds {props.startTime}
              </Typography>
            </Stack>
          </CardContent>
        </Box>
      </Card>
    </CardActionArea>
  );
}
