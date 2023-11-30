abstract class StorageProvider {
  public abstract Storage(): StorageProvider;

  public abstract Create(name: string, data: string): boolean;
  public abstract Delete(name: string): boolean;
  public abstract Get(name: string): string;
}
class LocalStorage extends StorageProvider {
  public Storage(): StorageProvider {
    return new LocalStorage();
  }

  public Create(name: string, data: string): boolean {
    return true;
  }
  public Delete(name: string): boolean {
    return true;
  }
  public Get(name: string): string {
    return '';
  }
}
class S3Storage extends StorageProvider {
  public Storage(): StorageProvider {
    return new LocalStorage();
  }

  public Create(name: string, data: string): boolean {
    return true;
  }
  public Delete(name: string): boolean {
    return true;
  }
  public Get(name: string): string {
    return '';
  }
}
