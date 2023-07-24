import React, { useState } from "react";
import { Slider as MuiSlider } from "@mui/material";

function Slider(props: any) {
  const [value, setValue] = useState<any>(30);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue);
  };
  console.log(value);
  return (
    <MuiSlider
      value={value}
      valueLabelDisplay="on"
      onChange={handleSliderChange}
      aria-labelledby="input-slider"
    />
  );
}

export default Slider;
