import { Injectable } from '@nestjs/common';
import puppeteer = require('puppeteer');
import { GenerateParamsDTO } from '../dto/generateParams.dto';
import {
  extractCourseraDetails,
  extractCourseraLinks,
} from './extract-course-detail-coursera';
import {
  extractDkCourseDetails,
  extractDomestikaLinks,
} from './extract-course-details';
const waitLoad: puppeteer.WaitForOptions = { waitUntil: 'networkidle2' };
const courseraURL = 'https://es.coursera.org/search';
const domestikaURL = 'https://www.domestika.org/es';

@Injectable()
export class ScrapperAlgorithm {
  async executeAlgorithm(queryParams: GenerateParamsDTO) {
    const registry = {};

    const browser = await puppeteer.launch({ headless: false });

    const domestikaPage = await browser.newPage();
    const url = new URL(domestikaURL);
    url.searchParams.set('query', queryParams.coursename);
    await domestikaPage.goto(url.toString(), waitLoad);

    const links = await extractDomestikaLinks(domestikaPage);
    registry[domestikaURL] = await extractDkCourseDetails(links, browser);
    domestikaPage.close();

    const courseraPage = await browser.newPage();
    const urlCoursera = new URL(courseraURL);
    urlCoursera.searchParams.set('query', queryParams.coursename);
    await courseraPage.goto(urlCoursera.toString(), waitLoad);

    const linksC = await extractCourseraLinks(courseraPage);
    registry[courseraURL] = await extractCourseraDetails(linksC, browser);
    courseraPage.close();

    browser.close();
    return registry;
  }
}
