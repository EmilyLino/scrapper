import { Module } from '@nestjs/common';
import { ScrapperModule } from './scrapper/scrapper.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ScrapperModule,
    MongooseModule.forRoot('mongodb://localhost/scrapper'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
