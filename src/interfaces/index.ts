export interface Video {
  createdAt: string;
  description: string;
  filedId: string;
  fileName: string;
  id: string;
  thumbnailUrl: string;
  title: string;
  transcodeDone: boolean;
}

export interface VideoDetail extends Video {
  manifestUrl: string;
  videoUrl: string;
}

export interface VideoUpload {
  title: string;
  description: string;
  filedId: string;
  fileName: string;
  thumbnailUrl: string;
}

export interface VttFileUpload {
  vttFile: File;
  videoId: string;
}

export interface Product {
  startTime: number;
  endTime: number;
  name: string;
  description: string;
  price: string;
  imgURL: string;
}
