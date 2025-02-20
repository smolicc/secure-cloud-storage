import { FileModel } from "./file.model";

export interface Bucket {
    id: string;
    name: string;
    location: string;
    files: FileModel[];
  }