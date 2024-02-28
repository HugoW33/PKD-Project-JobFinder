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

function arrayToText(arr: Array<string>): void {
    for (let i = 0; i < arr.length; i++) {
        console.log(`\n ${arr[i]}`);
    }
}

async function normaliseInput(): Promise<void> {
    let i: number = 0;
    let job: string = prompt("vilket jobb och stad: ");
    let page: string = prompt("vilken vill du börja på: ");
    //let question = prompt("vilken sida vill du sluta på: ");
    await scraperOneMain(page.toLocaleLowerCase(),job.toLocaleLowerCase());

    await scraperTwoMain(job.toLocaleLowerCase(), +page.toLocaleLowerCase());

    const NumPage = (+page) + 1;
    page = NumPage.toString();

   // console.log(JobbElements);

    jobArrCombind([JobbElements, JobLstArr]);
    //console.log(JobbArr);
    arrayToText(JobbArr);
    while (true) {
        let nextPagePrompt: string = prompt('vill du se en sida till? (ja/nej) eller vill du visa ett jobb (svara med annaonsens siffra): ');
        if (nextPagePrompt.toLocaleLowerCase() === 'ja') {

            arrayToText(JobbArr);
            const lastIndex = JobLstArr[-1];

            if (JobbElements.length % 13 !== 0 && lastIndex === JobLstArr[-1]) {
                console.error('Inga fler jobb !');
                continue;
            }
            if (JobbElements.length % 13 === 0) {
                await scraperOneMain(page.toLocaleLowerCase(), job.toLocaleLowerCase());
            } else {
                console.error('Inga fler jobb på blocket !!');
            }
            const num = (+page) + 1;
            page = num.toString();
            await scraperTwoMain(job.toLocaleLowerCase(), +page);
            if (lastIndex === JobLstArr[-1]) {
                console.error('Inga fler jobb på Arbetsförmedlingen');
                jobArrCombind([JobbElements]);
            } else {
                jobArrCombind([JobbElements, JobLstArr]);
            } 
            
        } else if (nextPagePrompt.toLocaleLowerCase() === 'nej') {
            if (+page === 1) {
                arrayToText(JobbArr);
            }
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