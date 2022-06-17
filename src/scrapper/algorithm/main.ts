import { Injectable } from '@nestjs/common';
import puppeteer = require('puppeteer');
import { GenerateParamsDTO } from '../dto/generateParams.dto';
import {
  scrapCourseraDetails,
  scrapCourseraLinks,
} from './extract-course-detail-coursera';
import {
  scrapDomestiakDetails,
  scrapDomestikaLinks,
} from './extract-course-details';

export const waitLoad: puppeteer.WaitForOptions = { waitUntil: 'networkidle2' };
export const k = 10 ** 3;

export const courseraURL: string = 'https://es.coursera.org/search';
export const domestikaURL: string = 'https://www.domestika.org/es';

@Injectable()
export class ScrapperAlgorithm {
  async executeAlgorithm(queryParams: GenerateParamsDTO) {
    const registry = {};

    const browser = await puppeteer.launch({ headless: false });

    const domestikaPage = await browser.newPage();
    const url = new URL(domestikaURL);
    url.searchParams.set('query', queryParams.coursename);
    await domestikaPage.goto(url.toString(), waitLoad);

    const links = await scrapDomestikaLinks(domestikaPage);
    registry[domestikaURL] = await scrapDomestiakDetails(links, browser);
    domestikaPage.close();

    const courseraPage = await browser.newPage();
    const urlCoursera = new URL(courseraURL);
    urlCoursera.searchParams.set('query', queryParams.coursename);
    await courseraPage.goto(urlCoursera.toString(), waitLoad);

    const linksC = await scrapCourseraLinks(courseraPage);
    registry[courseraURL] = await scrapCourseraDetails(linksC, browser);
    courseraPage.close();

    browser.close();
    return registry;
  }
}
