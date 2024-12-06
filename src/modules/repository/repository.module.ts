import { Global, Module } from '@nestjs/common';
import { CategoryRepository } from './services/category.repository';

const repositories = [CategoryRepository];

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
