import {type JobbLst, JobbElements, main as scraperOneMain } from "./scraper_one";
import * as promptSync from 'prompt-sync'
import { retrieveHeaderUrls as scraperTwoMain, JobLstArr, displayRequirements} from "./main2";

const JobbArr: Array<string> = [];
const prompt = promptSync();
//Array with type jobLst used to print out relevant information that is not
//displayed to the user
const allJobsLst: JobbLst = [];

function jobArrCombind(arr: Array<JobbLst>): void {
    let numberOfJobsPerPage = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let jobLsting of arr[i]) {
            if (jobLsting.stad !== '') {
                JobbArr.push(`${JobbArr.length + 1}: ${jobLsting.title} i ${jobLsting.stad}`);
                allJobsLst.push({title: jobLsting.title, stad: jobLsting.stad,
                                 url: jobLsting.url});
            } else {
                JobbArr.push(`${JobbArr.length + 1}: ${jobLsting.title}`);
                allJobsLst.push({title: jobLsting.title, stad: jobLsting.stad,
                                 url: jobLsting.url});
            }
            numberOfJobsPerPage++;
            if (numberOfJobsPerPage >= 25) {
                return;
            }
        }
    }
}

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

    jobArrCombind([JobbElements, JobLstArr]);
    // for (let i = JobbArr.length + 1; i < JobbElements.length; i++) {
    //     JobbArr.push(`${i}: ${JobbElements[i].title} i ${JobbElements[i].stad}`);
    //     allJobsLst.push({title: JobbElements[i].title, stad: JobbElements[i].stad, 
    //                     url: JobbElements[i].url});
    // }
    // for (let i = JobbArr.length; i < JobLstArr.length; i++) {
    //     JobbArr.push(`${i}: ${JobLstArr[i].title}`);
    //     allJobsLst.push({title: JobLstArr[i].title, stad: JobLstArr[i].stad, 
    //                     url: JobLstArr[i].url});
    // }

    console.log(JobbArr);
    while (true) {
        let nextPagePrompt: string = prompt('vill du se en sida till? (ja/nej) eller vill du visa ett jobb (svara med annaonsens siffra): ');
        if (nextPagePrompt.toLocaleLowerCase() === 'ja') {
            const num = (+page) + 1;
            page = num.toString();
            await scraperOneMain(page.toLocaleLowerCase(), job.toLocaleLowerCase());
            await scraperTwoMain(job.toLocaleLowerCase(), +page);
            jobArrCombind([JobbElements, JobLstArr]);
            // for (let i = JobbArr.length; i < JobbElements.length; i++) {
            //     JobbArr.push(`${i}: ${JobbElements[i].title} i ${JobbElements[i].stad}`);
            //     allJobsLst.push({title: JobbElements[i].title, stad: JobbElements[i].stad, 
            //                      url: JobbElements[i].url});
            // }
            // for (let i = JobbArr.length; i < JobLstArr.length; i++) {
            //     JobbArr.push(`${i}: ${JobLstArr[i].title}`);
            //     allJobsLst.push({title: JobLstArr[i].title, stad: JobLstArr[i].stad, 
            //                     url: JobLstArr[i].url});
            // }
            console.log(JobbArr);
        } else if (nextPagePrompt.toLocaleLowerCase() === 'nej') {
            break;
        } else if (!isNaN(parseInt(nextPagePrompt))) {
            let jobNum: number = parseInt(nextPagePrompt);
            //console.log(allJobsLst[jobNum].url);
            const reqs = await displayRequirements(allJobsLst[jobNum].url);
            if (allJobsLst[jobNum].url.includes('jobb.blocket')) {
                console.log(`Se anonnsen för krav: \n${allJobsLst[jobNum].url}`);
            }
            reqs.forEach(reqs => {
                console.log(reqs.header);
            });
        
        } else {
            console.log('Inte ett giltigt svar!');
        }
    }
}

normaliseInput();