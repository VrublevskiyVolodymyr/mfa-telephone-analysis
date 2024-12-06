import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CallEntity } from '../../../database/entities/call.entity';

@Injectable()
export class CallRepository extends Repository<CallEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CallEntity, dataSource.manager);
  }
}
