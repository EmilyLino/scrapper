import { Module } from '@nestjs/common';
import { ScrapperController } from './scrapper.controller';
import { ScrapperService } from './scrapper.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema, Course } from './schemas/course.schame';
import { ScrapperAlgorithm } from './algorithm/main';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
  ],
  controllers: [ScrapperController],
  providers: [ScrapperService, ScrapperAlgorithm],
})
export class ScrapperModule {}
