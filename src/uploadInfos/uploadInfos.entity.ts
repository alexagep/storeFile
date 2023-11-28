import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('UploadInfos')
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

  @Column({ nullable: true  })
  path: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date | string;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | string;
}
