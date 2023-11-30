export interface IStorageProviderFactory {
  createStorageProvider(): IStorageProvider;
}

export interface IStorageProvider {
  saveFile(data: string, filename: string): Promise<string>;
  deleteFile(location: string): Promise<void>;
}
