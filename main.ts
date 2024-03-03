import {type JobbLst, JobbElements, main as scraperOneMain } from "./scraper_one";
import  * as promptSync from 'prompt-sync'
import { retrieveHeaderUrls as scraperTwoMain, JobLstArr, displayRequirements} from "./main2";

export const JobbArr: Array<string> = [];
const prompt = promptSync();
//Array with type jobLst used to print out relevant information that is not
//displayed to the user
export const allJobsLst: JobbLst = [];

export function jobArrCombind(arr: Array<JobbLst>): void {
    let numberOfJobsPerPage = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let jobLsting of arr[i]) {
            let exists: boolean = false;
            allJobsLst.forEach(element => {
                if (element.url === jobLsting.url) {
                    exists = true;
                }
            });
            if (exists) {
                continue;
            }
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

export async function normaliseInput(): Promise<void> {
    //let i: number = 0;
    const job: string = prompt("vilket jobb och stad: ");
    if (job === undefined) {
        console.log('Oj, något gick fel!');
    }
    //let page: string = prompt("vilken vill du börja på: ");
    let page: number = 1;
    //let question = prompt("vilken sida vill du sluta på: ");

    await scraperOneMain(page.toString(),job.toLocaleLowerCase());
    await scraperTwoMain(job.toLocaleLowerCase(), page);

    // const NumPage = (+page) + 1;
    // page = NumPage;

   // console.log(JobbElements);

    jobArrCombind([JobbElements, JobLstArr]);
    //console.log(JobbArr);
    arrayToText(JobbArr);
    while (true) {
        let nextPagePrompt: string = prompt('vill du se en sida till? (ja/nej) eller vill du visa ett jobb (svara med annaonsens siffra): ');        
        if (nextPagePrompt.toLocaleLowerCase() === 'ja') {

            const lastIndex = JobLstArr.slice(-1);
            page += 1;
            await scraperTwoMain(job.toLocaleLowerCase(), page);
            if (JobbElements.length % 13 !== 0 && lastIndex[0].url === JobLstArr.slice(-1)[0].url) {
                console.error('Inga fler jobb !');
                continue;
            }

            if (JobbElements.length % 13 === 0) {
                await scraperOneMain(page.toString(), job.toLocaleLowerCase());
            } else {
                console.error('Inga fler jobb på blocket !!');
                jobArrCombind([JobLstArr]);
            }

            //const num = page + 1;
            if (lastIndex[0].url === JobLstArr.slice(-1)[0].url) {
                console.error('Inga fler jobb på Arbetsförmedlingen');
                jobArrCombind([JobbElements]);
            } else {
                jobArrCombind([JobbElements, JobLstArr]);
            }
            arrayToText(JobbArr);

        } else if (nextPagePrompt.toLocaleLowerCase() === 'nej') {
            break;
        } else if (!isNaN(parseInt(nextPagePrompt))) {
            let jobNum: number = parseInt(nextPagePrompt) - 1;
            //console.log(allJobsLst[jobNum].url);
            const reqs = await displayRequirements(allJobsLst[jobNum].url);
            if (allJobsLst[jobNum].url.includes('jobb.blocket')) {
                console.log(`Se anonnsen för krav: \n${allJobsLst[jobNum].url}`);
            } else {
                console.log(`Annons: ${allJobsLst[jobNum].url}`);
                reqs.forEach(reqs => {
                    console.log(reqs.header);
                });
            }

        
        } else {
            console.log('Inte ett giltigt svar!');
        }
    }
}

//normaliseInput();