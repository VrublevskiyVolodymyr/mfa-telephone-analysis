import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CreateUpdateModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', precision: 0 })
  created: Date;

  @UpdateDateColumn({ type: 'timestamp', precision: 0 })
  updated: Date;
}
