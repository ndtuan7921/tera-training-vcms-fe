import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import React, { useEffect } from "react";
import { UPLOAD_SERVICE_URL } from "../../../env.config";
import { Stack, Typography } from "@mui/material";
import { Dashboard } from "@uppy/react";

const TUS_ENDPOINT = "https://tusd.tusdemo.net/files/";

const uppy = new Uppy({
  debug: true,
  autoProceed: true,
  restrictions: {
    maxNumberOfFiles: 1,
    allowedFileTypes: ["image/*"],
  },
}).use(Tus, {
  endpoint: UPLOAD_SERVICE_URL + "/upload",
  // endpoint: TUS_ENDPOINT,
});

function ImageUploader(props: any) {
  const { handleThumbnail, isSubmitted, setIsSubmitted } = props;

  useEffect(() => {
    if (isSubmitted) {
      uppy.cancelAll();
      setIsSubmitted(false);
    }
  }, [isSubmitted]);

  uppy.on("file-added", (file) => {
    uppy.setMeta({ uploadType: "thumbnail" });
  });

  uppy.on("upload-success", function (file, upload) {
    handleThumbnail(file!.data.name);
  });

  return (
    <Dashboard
      height={"100%"}
      uppy={uppy}
      proudlyDisplayPoweredByUppy={false}
    />
  );
}

export default ImageUploader;
