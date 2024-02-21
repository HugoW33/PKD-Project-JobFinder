import { promise } from "selenium-webdriver";
import {type JobbLst, JobbElements, main as scraperOneMain } from "./scraper_one";
import * as promptSync from 'prompt-sync'
import { retrieveHeaderUrls as scraperTwoMain, JobLstArr} from "./main2";

const JobbArr: Array<string> = [];
const prompt = promptSync();

async function normaliseInput(): Promise<void> {
    let i: number = 0;
    let job: string = prompt("vilket jobb och stad: ");
    let page: string = prompt("vilken vill du börja på: ");
    let question = prompt("vilken sida vill du sluta på: ");
    for (let a = +page; a <= +question; a++) {
        await scraperOneMain(page.toLocaleLowerCase(),job.toLocaleLowerCase());
        await scraperTwoMain(job.toLocaleLowerCase(), +page.toLocaleLowerCase());
        if (a === +question) {
            break;
        }
        else {
            const NumPage = (+page) + 1;
            page = NumPage.toString();
        }
    }
   // console.log(JobbElements);

    for (let i = JobbArr.length + 1; i < JobbElements.length; i++) {
        JobbArr.push(`${i}: ${JobbElements[i].title} i ${JobbElements[i].stad}`);
    }
    for (let i = JobbArr.length; i < JobLstArr.length; i++) {
        JobbArr.push(`${i}: ${JobLstArr[i].title}`);
    }

    console.log(JobbArr);
    while (true) {
        let nextPagePrompt: string = prompt('vill du se en sida till? (ja/nej): ');
        if (nextPagePrompt.toLocaleLowerCase() === 'ja') {
            const num = +page + 1;
            page = num.toString();
            await scraperOneMain(page.toLocaleLowerCase(), job.toLocaleLowerCase());
            await scraperTwoMain(job.toLocaleLowerCase(), +page);
            for (let i = JobbArr.length; i < JobbElements.length; i++) {
                JobbArr.push(`${i}: ${JobbElements[i].title} i ${JobbElements[i].stad}`);
            }
            for (let i = JobbArr.length; i < JobLstArr.length; i++) {
                JobbArr.push(`${i}: ${JobLstArr[i].title}`);
            }
            console.log(JobbArr);
        } else if (nextPagePrompt.toLocaleLowerCase() === 'nej') {
            break;
        } else {
            console.log('Inte ett giltigt svar!');
        }
    }
}

normaliseInput();