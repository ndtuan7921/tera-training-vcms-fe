import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { useEffect } from "react";
import { UPLOAD_SERVICE_URL, VTT_SERVICE_URL } from "../../../env.config";
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
  //   endpoint: TUS_ENDPOINT,
});

function ProductImageUploader(props: any) {
  const { handleProductImage, isSubmitted, setIsSubmitted } = props;

  useEffect(() => {
    if (isSubmitted) {
      uppy.cancelAll();
      setIsSubmitted(false);
    }
  }, [isSubmitted]);

  uppy.on("file-added", (file) => {
    uppy.setMeta({ uploadType: "vtt_image" });
    uppy.setFileMeta(file.id, {
      name: file.name,
    });
  });

  uppy.on("upload-success", function (file, upload) {
    handleProductImage(VTT_SERVICE_URL + "/vtt-image/" + file!.name);
  });

  return (
    <Dashboard
      height={"100%"}
      uppy={uppy}
      proudlyDisplayPoweredByUppy={false}
    />
  );
}

export default ProductImageUploader;
