export abstract class IStorageProvider {
  public abstract saveFile(data: string, filename?: string): Promise<string>;
  public abstract deleteFile(location: string): Promise<void>;
  public abstract readFile(location: string): Promise<string> 
}