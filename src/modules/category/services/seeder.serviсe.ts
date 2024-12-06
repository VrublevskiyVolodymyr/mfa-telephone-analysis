import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../../../database/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class Seeder {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async seed() {
    const categories = [
      {
        title: 'Visa and Passport Services',
        points: [
          'border crossing',
          'international documentation',
          'visa application',
          'passport renewal',
          'visa fees',
          'border regulations',
          'visa processing',
          'embassy appointment',
          'travel authorization',
          'passport validity',
        ],
      },
      {
        title: 'Diplomatic Inquiries',
        points: [
          'diplomatic requests',
          'consular services',
          'embassy services',
          'official communications',
          'foreign affairs',
          'diplomatic status',
          'visa treaties',
          'cultural exchange',
          'protocol services',
        ],
      },
      {
        title: 'Travel Advisories',
        points: [
          'travel',
          'advisory',
          'tourism',
          'travel restrictions',
          'safety information',
          'local laws',
          'cultural tips',
          'health advisories',
          'natural disasters',
          'transportation options',
          'accommodation',
        ],
      },
      {
        title: 'Consular Assistance',
        points: [
          'consular assistance',
          'citizen support',
          'emergency services',
          'document verification',
          'legal assistance',
          'reporting lost documents',
          'repatriation',
          'notary services',
          'civil registration',
          'identity verification',
        ],
      },
      {
        title: 'Trade and Economic Cooperation',
        points: [
          'trade',
          'economy',
          'cooperation',
          'business inquiries',
          'investment opportunities',
          'export regulations',
          'market access',
          'trade agreements',
          'economic partnerships',
          'financial regulations',
        ],
      },
      {
        title: 'General questions',
        points: [],
      },
    ];

    for (const category of categories) {
      const exists = await this.categoryRepository.findOne({
        where: { title: category.title },
      });
      if (!exists) {
        await this.categoryRepository.save(
          this.categoryRepository.create(category),
        );
      }
    }
  }
}
