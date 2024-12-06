import { PickType } from '@nestjs/swagger';
import { BaseCallResDto } from './base-call-res.dto';

export class CallResDto extends PickType(BaseCallResDto, [
  'id',
  'name',
  'location',
  'emotionalTone',
  'text',
  'categories',
  'audioUrl',
]) {}
