import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ApiResponse } from './dto/api-respode.dto';
import { CreateCourseDTO } from './dto/create-course.dto';
import { GenerateParamsDTO } from './dto/generateParams.dto';
import { Course } from './schemas/course.schame';
import { ScrapperService } from './scrapper.service';

@Controller('scrapper')
export class ScrapperController {
  constructor(private readonly scrapperService: ScrapperService) {}

  @Get()
  get(): Promise<Course[]> {
    return this.scrapperService.findAll();
  }

  @Get('/search')
  search(@Query() queryParams: GenerateParamsDTO) {
    return this.scrapperService.scrapCourses(queryParams);
  }

  @Post('/random')
  randomCrawler(@Body() generateParamsDTO: GenerateParamsDTO) {
    return this.scrapperService.randomCrawler(generateParamsDTO);
  }

  @Post()
  create(@Body() createCourseDTO: CreateCourseDTO) {
    const course = this.scrapperService.createCourse(createCourseDTO);
    return new ApiResponse('Course created successfully', course);
  }
}
