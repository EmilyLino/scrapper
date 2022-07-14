import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from './schemas/course.schame';
import { GenerateParamsDTO } from './dto/generateParams.dto';
import { CreateCourseDTO } from './dto/create-course.dto';
import puppeteer = require('puppeteer');
import { ScrapperAlgorithm } from './algorithm/main';

@Injectable()
export class ScrapperService {
  private readonly URL: string = 'https://es.coursera.org/search';

  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    private readonly scrapperAlgorithm: ScrapperAlgorithm,
  ) {}

  /*   {
    "title": "dcdd",
    "imagen": "",
    "link": "cdc",
    "description?": "dccsd",
    "price?": ""
  } */

  async scrapCourses(queryParams: GenerateParamsDTO) {
    return await this.scrapperAlgorithm.executeAlgorithm(queryParams);
  }

  async randomCrawler(generateParamsDTO: GenerateParamsDTO) {
    const browser = await puppeteer.launch({ headless: false });

    const registry = {};
    let queue = [generateParamsDTO.coursename];

    while (queue.length > 0) {
      const url = queue[queue.length - 1];
      console.log('current URL:', url);
      const page = await browser.newPage();
      await page.goto(url);
      registry[url] = await page.$eval(
        '*',
        (el: HTMLAnchorElement) => el.innerText,
      );
      queue.pop();
      console.log('queue length:', queue);

      const hrefs = await page.$$eval('a', (options) =>
        options.map((option: HTMLAnchorElement) => option.href),
      );

      const filterHrefs = hrefs.filter(
        (href) =>
          href.startsWith(generateParamsDTO.coursename) &&
          registry[href] === undefined,
      );
      const uniqueHrefs = [...new Set(filterHrefs)];
      queue.push(...uniqueHrefs);
      queue = [...new Set(queue)];

      await page.close();
    }

    browser.close();

    return registry;
  }

  async findAll(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  async createCourse(
    createCourseDTO: CreateCourseDTO,
  ): Promise<CourseDocument> {
    return this.courseModel.create(createCourseDTO);
  }
}
