import { CONTENT_SERVICE_URL, VTT_SERVICE_URL } from "../../env.config";
import { VideoUpdate, VideoUpload } from "../interfaces";
import { parseWebVtt } from "../utils/parseVTTFile";

/* GET */

export const getAllVideos = async () => {
  try {
    const URL = `${CONTENT_SERVICE_URL}/api/videos/all`;
    const res = await fetch(URL);
    let data = await res.json();
    return data;
  } catch (error) {
    console.log("Error:", error);
  }
};

export const getVideoById = async (id: string) => {
  try {
    const URL = `${CONTENT_SERVICE_URL}/api/videos/${id}`;
    const res = await fetch(URL);
    let data = await res.json();
    return data;
  } catch (error) {
    console.log("Error:", error);
  }
};

export const getVideo = async (pageSize: number, pageNumber: number) => {
  try {
    const URL = `${CONTENT_SERVICE_URL}/api/videos?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    const data = await fetch(URL);
    const result = await data.json();
    return {
      ...result,
    };
  } catch (error) {
    console.log("Error:", error);
  }
};

export const getVTTFileByVideoId = async (id: string) => {
  try {
    const URL = `${VTT_SERVICE_URL}/api/vtts/${id}`;
    const res = await fetch(URL);
    let data = await res.json();
    // console.log(data);
    if (data.statusCode == 404) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    console.log("Error:", error);
  }
};

export const getProductListByVTTFile = async (vttURL: string) => {
  try {
    const URL = vttURL;
    const res = await fetch(URL);
    if (res.status == 404) return [];
    const data = await res.text();
    const result = parseWebVtt(data);
    return result;
  } catch (error) {
    console.log("Error:", error);
  }
};

export const getResolutionList = async (URL: string) => {
  try {
    const res = await fetch(URL);
    const playlist = await res.text();
    return playlist;
  } catch (error) {
    console.log("Error:", error);
  }
};

/* POST */

export const uploadVideo = async (video: VideoUpload) => {
  try {
    const response = await fetch(`${CONTENT_SERVICE_URL}/api/videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...video }),
    });
    return response;
  } catch (error) {
    console.error("Error uploading video:", error);
  }
};

export const uploadVTTFile = async (vttFile: any) => {
  try {
    const response = await fetch(`${VTT_SERVICE_URL}/api/vtts/upload`, {
      method: "POST",
      body: vttFile,
    });
    return response;
  } catch (error) {
    console.error("Error uploading vtt file:", error);
  }
};

/* DELETE */
export const deleteVideo = async (id: string) => {
  try {
    const URL = `${CONTENT_SERVICE_URL}/api/videos/${id}`;
    const res = await fetch(URL, {
      method: "DELETE",
    });
    return res;
  } catch (error) {
    console.error("Error deleting video:", error);
  }
};

export const deleteVTTFile = async (videoId: string) => {
  try {
    const URL = `${VTT_SERVICE_URL}/api/vtts/${videoId}`;
    const res = await fetch(URL, {
      method: "DELETE",
    });
    // handle response
    if (!res.ok) {
      throw new Error("Failed to delete vtt file");
    }
    return res;
  } catch (error) {
    console.error("Error deleting video:", error);
  }
};

/* PUT */
export const updateVideo = async (id: string, videoUpdate: VideoUpdate) => {
  try {
    const URL = `${CONTENT_SERVICE_URL}/api/videos/${id}`;
    const res = await fetch(URL, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ ...videoUpdate }),
    });
    return res;
  } catch (error) {
    console.error("Error:", error);
  }
};
