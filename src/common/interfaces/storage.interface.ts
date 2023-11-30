import { UploadInfos } from "src/uploadInfos/uploadInfos.entity";

// export interface IStorageProviderFactory {
//   createStorageProvider(): IStorageProvider;
// }

export abstract class IStorageProvider {
  public abstract saveFile(data: string, filename?: string): Promise<string>;
  public abstract deleteFile(location: string): Promise<void>;
  public abstract readFile(location: string): Promise<string> 
}


// abstract class StorageProvider {
//   public abstract saveFile(): Promise<string>;
//   public abstract deleteFile(name: string): boolean;
// //   public abstract Get(name: string): string;
// }
