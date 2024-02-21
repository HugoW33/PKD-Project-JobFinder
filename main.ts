import {type JobbLst, JobbElements, main as scraperOneMain } from "./scraper_one";
import * as promptSync from 'prompt-sync'
import { retrieveHeaderUrls as scraperTwoMain, JobLstArr, displayRequirements} from "./main2";

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

   const allJobsLst: JobbLst = [];

    for (let i = JobbArr.length + 1; i < JobbElements.length; i++) {
        JobbArr.push(`${i}: ${JobbElements[i].title} i ${JobbElements[i].stad}`);
        allJobsLst.push({title: JobbElements[i].title, stad: JobbElements[i].stad, 
                        url: JobbElements[i].url});
    }
    for (let i = JobbArr.length; i < JobLstArr.length; i++) {
        JobbArr.push(`${i}: ${JobLstArr[i].title}`);
        allJobsLst.push({title: JobLstArr[i].title, stad: JobLstArr[i].stad, 
                        url: JobLstArr[i].url});
    }

    console.log(JobbArr);
    while (true) {
        let nextPagePrompt: string = prompt('vill du se en sida till? (ja/nej) eller vill du visa ett jobb (svara med annaonsens siffra): ');
        if (nextPagePrompt.toLocaleLowerCase() === 'ja') {
            const num = (+page) + 1;
            page = num.toString();
            await scraperOneMain(page.toLocaleLowerCase(), job.toLocaleLowerCase());
            await scraperTwoMain(job.toLocaleLowerCase(), +page);
            for (let i = JobbArr.length; i < JobbElements.length; i++) {
                JobbArr.push(`${i}: ${JobbElements[i].title} i ${JobbElements[i].stad}`);
                allJobsLst.push({title: JobbElements[i].title, stad: JobbElements[i].stad, 
                                 url: JobbElements[i].url});
            }
            for (let i = JobbArr.length; i < JobLstArr.length; i++) {
                JobbArr.push(`${i}: ${JobLstArr[i].title}`);
                allJobsLst.push({title: JobLstArr[i].title, stad: JobLstArr[i].stad, 
                                url: JobLstArr[i].url});
            }
            console.log(JobbArr);
        } else if (nextPagePrompt.toLocaleLowerCase() === 'nej') {
            break;
        } else if (!isNaN(parseInt(nextPagePrompt))) {
            let jobNum: number = parseInt(nextPagePrompt);
            //console.log(allJobsLst[jobNum].url);
            const cringe = await displayRequirements(allJobsLst[jobNum].url);
            if (allJobsLst[jobNum].url.includes('jobb.blocket')) {
                console.log(`Se anonnsen för krav: \n${allJobsLst[jobNum].url}`);
            }
            cringe.forEach(cringe => {
                console.log(cringe.header);
            });
        
        } else {
            console.log('Inte ett giltigt svar!');
        }
    }
}

normaliseInput();