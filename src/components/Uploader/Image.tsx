import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import React, { useEffect, useState } from "react";
import { UPLOAD_SERVICE_URL } from "../../../env.config";
import { Dashboard } from "@uppy/react";

const TUS_ENDPOINT = "https://tusd.tusdemo.net/files/";

const uppy = new Uppy({
  debug: true,
  autoProceed: true,
  restrictions: {
    maxNumberOfFiles: 1,
    allowedFileTypes: ["image/*"],
  },
  onBeforeFileAdded: (currentFile, files) => {
    const tick = new Date().getTime();
    const modifiedFile = {
      ...currentFile,
      name:
        currentFile.name.replace(/\s+/g, "").replace(/\.[^/.]+$/, "") +
        "_" +
        tick +
        "." +
        currentFile.extension,
    };
    return modifiedFile;
  },
}).use(Tus, {
  endpoint: UPLOAD_SERVICE_URL + "/upload",
  // endpoint: TUS_ENDPOINT,
});

interface ImageUploaderProps {
  handleImage: any;
  activeForm?: boolean;
  setActiveForm?: any;
  isFormSubmited: boolean;
  type: string;
}

function ImageUploader(props: ImageUploaderProps) {
  const { handleImage, activeForm, setActiveForm, isFormSubmited, type } =
    props;

  useEffect(() => {
    !isFormSubmited && uppy.cancelAll();
  }, [isFormSubmited]);

  uppy.on("file-added", (file) => {
    uppy.setMeta({ uploadType: type });
    uppy.setFileMeta(file.id, {
      name: file.name,
    });
  });

  uppy.on("complete", (results) => {
    results.successful.length > 0 &&
      console.log("upload image successful", results.successful);
    results.failed.length > 0 &&
      console.log("upload image failed", results.failed);
  });

  uppy.on("upload-success", function (file, upload) {
    handleImage(file!.name);
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
