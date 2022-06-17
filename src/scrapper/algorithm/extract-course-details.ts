import puppeteer = require('puppeteer');
import { CourseInterface } from '../interfaces/course.interface';

export async function scrapDomestikaLinks(
  page: puppeteer.Page,
): Promise<CourseInterface[]> {
  const coursesFound = await page.$('.ais-Stats-text');

  let registry = [];
  if (!coursesFound) {
    registry = await page.$$eval('li > a.row', (options) =>
      options.map((option: HTMLLinkElement) => {
        let details: CourseInterface;
        const img: HTMLImageElement = option.querySelector('img');
        const title: HTMLHeadingElement = option.querySelector('h3');

        details.link = option.href;
        details.imagen = img.src;
        details.title = title.innerText;
        return details;
      }),
    );
  }

  return registry;
}

export async function scrapDomestiakDetails(
  courseDetails: Array<CourseInterface>,
  browser: puppeteer.Browser,
) {
  const domestikaCourses = [];
  while (courseDetails.length > 0) {
    let currentCourse: CourseInterface =
      courseDetails[courseDetails.length - 1];
    console.log('current URL:', currentCourse.link);

    const newPage = await browser.newPage();
    await newPage.goto(currentCourse.link);
    courseDetails.pop();

    try {
      currentCourse.price = await newPage.$eval(
        '.m-price.m-price--code',
        (el: HTMLSpanElement) => el.innerText,
      );
      currentCourse.description = await newPage.$eval(
        '.text-body-bigger-new',
        (el: HTMLAnchorElement) => el.innerText,
      );
    } catch (err) {
      console.error(
        `Ha ocurrido un error en la extraccion de los detalles en el enlace: ${currentCourse.link} error: ${err}`,
      );
    }

    domestikaCourses.push(currentCourse);
    newPage.close();
  }
  return domestikaCourses;
}
