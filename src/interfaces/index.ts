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

export interface VideoUpload {
  title: string;
  description: string;
  filedId: string;
  fileName: string;
  thumbnailUrl: string;
}
