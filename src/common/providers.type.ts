import { LocalStorageService } from "./providers-factory/local-storage-provider";
import { S3StorageService } from "./providers-factory/s3-storage-provider";


export type StorageType = LocalStorageService | S3StorageService