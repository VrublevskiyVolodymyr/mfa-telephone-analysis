import { CallEntity } from '../../../database/entities/call.entity';
import { CallResDto } from '../dto/res/call-res.dto';

export class CallMapper {
  static toResponseDto(callEntity: CallEntity): CallResDto {
    return {
      id: callEntity.id,
      name: callEntity.name,
      location: callEntity.location,
      emotionalTone: callEntity.emotionalTone,
      text: callEntity.text,
      categories: callEntity.categories
        ? callEntity.categories.map((category) => category.title)
        : [],
    } as CallResDto;
  }
}
