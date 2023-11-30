export interface IStorageProviderFactory {
  createStorageProvider(): StorageProvider;
}

export interface IStorageProvider {
  saveFile(data: string, filename: string): Promise<string>;
  deleteFile(location: string): Promise<void>;
}
