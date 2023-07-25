import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { useEffect } from "react";
import { UPLOAD_SERVICE_URL } from "../../../env.config";
import { Dashboard } from "@uppy/react";

const TUS_ENDPOINT = "https://tusd.tusdemo.net/files/";

const uppy = new Uppy({
  debug: true,
  autoProceed: true,
  restrictions: {
    maxNumberOfFiles: 1,
    allowedFileTypes: ["video/*"],
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
  //   endpoint: TUS_ENDPOINT,
});

function VideoUploader(props: any) {
  const {
    handleUpload,
    handleVideoData,
    isSubmitted,
    setIsSubmitted,
    setIsVideoUploaded,
  } = props;
  useEffect(() => {
    if (isSubmitted) {
      uppy.cancelAll();
      setIsSubmitted(false);
    }
  }, [isSubmitted, setIsSubmitted]);

  uppy.on("file-added", (file) => {
    uppy.setMeta({ uploadType: "video" });

    uppy.setFileMeta(file.id, {
      name: file.name,
    });
  });

  uppy.on("complete", ({ successful, failed }) => {
    console.log("successful\t", successful);
    console.log("failed\t", failed);
  });

  uppy.on("upload-success", function (file, upload) {
    setIsVideoUploaded(true);
    console.log(file);
    handleVideoData({ fileName: file!.name, fileId: file!.id });
  });

  uppy.on("file-removed", (file, reason) => {
    setIsVideoUploaded(false);
  });

  return <Dashboard uppy={uppy} proudlyDisplayPoweredByUppy={false} />;
}

export default VideoUploader;
