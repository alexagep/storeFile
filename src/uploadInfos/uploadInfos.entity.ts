import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('UploadInfos')
@Index(['name', 'tag'])
export class UploadInfos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: false })
  tag: string;

  @Column({ nullable: false })
  type: string;

  @Column({ nullable: false })
  location: string;

  @Column({ type: 'boolean', default: false })
  isDownloaded: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date | string;
}
