import { CONTENT_SERVICE_URL, VTT_SERVICE_URL } from "../../env.config";
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

export const getVTTFileByVideoId = async (id: string) => {
  try {
    const URL = `${VTT_SERVICE_URL}/api/vtts/${id}`;
    const res = await fetch(URL);
    let data = await res.json();
    return data;
  } catch (error) {
    console.log("Error:", error);
  }
};

export const getProductListByVTTFile = async (vttURL: string) => {
  try {
    const URL = vttURL;
    const res = await fetch(URL);
    const webvttContent = await res.text();
    const result = parseWebVtt(webvttContent);
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
/* GET */
