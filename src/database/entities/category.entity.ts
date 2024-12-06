import { CreateUpdateModel } from '../models/create-update.model';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { TableNameEnum } from '../enums/table-name.enum';
import { CallEntity } from './call.entity';

@Entity(TableNameEnum.Categories)
export class CategoryEntity extends CreateUpdateModel {
  @Column('text')
  title: string;
  @Column('text', { array: true, default: () => 'ARRAY[]::text[]' })
  points: string[];
  @ManyToMany(() => CallEntity, (call) => call.categories)
  @JoinTable({ name: 'category_calls' })
  calls: CallEntity[];
}
