import { Column, Entity, ManyToMany } from 'typeorm';
import { CreateUpdateModel } from '../models/create-update.model';
import { TableNameEnum } from '../enums/table-name.enum';
import { TonEnum } from '../enums/ton.enum';
import { CategoryEntity } from './category.entity';

@Entity(TableNameEnum.Calls)
export class CallEntity extends CreateUpdateModel {
  @Column({ nullable: true })
  name: string | null;

  @Column({ nullable: true })
  location: string | null;

  @Column({ type: 'enum', enum: TonEnum })
  emotionalTone: TonEnum;

  @Column({ type: 'text', nullable: true })
  text: string | null;

  @ManyToMany(() => CategoryEntity, (category) => category.calls, {
    nullable: true,
  })
  categories: CategoryEntity[];

  @Column()
  audioUrl: string;
}
