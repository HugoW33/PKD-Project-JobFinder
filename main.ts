import {type JobbLst, JobbElements, main as scraperOneMain } from "./scraper_one";
import  * as promptSync from 'prompt-sync'
import { retrieveHeaderUrls as scraperTwoMain, JobLstArr, displayRequirements} from "./main2";

export const JobbArr: Array<string> = [];
const prompt = promptSync();
//Array with type jobLst used to print out relevant information that is not
//displayed to the user
export const allJobsLst: JobbLst = [];
let testMode: boolean = false

/**
 * Function to toggle test mode. Needed because some functionality is hard to test
 * and requires some slight modification of the code. Is only to be used in
 * main.test.ts
 * @param mode - boolean input that tells the program if test mode is to
 * be toggled
 * @returns void
 */
export const toggleTestMode = (mode: boolean): void => {
    testMode = mode;
};

/**
 * Function to combine results from different web scrapers used.
 * Pushes information to the string array and the behind the hood
 * array allJobsLst used to store raw data not shown to the user
 * @param arr - An array containing objects with type JobbLst
 * @returns void
 */
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
//Text function
//@return{void} - Doesent return anything, only console.log's
//@param{arr} - A array<string> with n elements to be printed
//@precondition - if the array is empty nothing happens. 
function arrayToText(arr: Array<string>): void {
    for (let i = 0; i < arr.length; i++) {
        console.log(`\n ${arr[i]}`);
    }
}
//Main runing function
//@return{promise<void>} - doesent return anything, resolves a prommise
//@precondition - The imputs provided by the user are of the type that the prompt asks for
export async function normaliseInput(): Promise<void> {
    const job: string = prompt("vilket jobb och stad: ");
    if (job === undefined) {
        console.log('Oj, något gick fel!');
    }
    let page: number = 1;

    await scraperOneMain(page.toString(),job.toLocaleLowerCase());
    await scraperTwoMain(job.toLocaleLowerCase(), page);



    jobArrCombind([JobbElements, JobLstArr]);
    arrayToText(JobbArr);
    while (true) {
        let nextPagePrompt: string = prompt('vill du se en sida till? (ja/nej) eller vill du visa ett jobb (svara med annaonsens siffra): ');        
        if (nextPagePrompt.toLocaleLowerCase() === 'ja') {

            const lastIndex = JobLstArr.slice(-1);
            page += 1;
            await scraperTwoMain(job.toLocaleLowerCase(), page);
            if (JobbElements.length % 13 !== 0 && lastIndex[0].url === JobLstArr.slice(-1)[0].url) {
                if (testMode) {
                    console.log('Inga fler jobb !');
                    break;
                }
                console.log('Inga fler jobb !');
                continue;
            }

            if (JobbElements.length % 13 === 0) {
                await scraperOneMain(page.toString(), job.toLocaleLowerCase());
            } else {
                console.log('Inga fler jobb på blocket !!');
                jobArrCombind([JobLstArr]);
            }

            if (lastIndex[0].url === JobLstArr.slice(-1)[0].url) {
                console.log('Inga fler jobb på Arbetsförmedlingen');
                jobArrCombind([JobbElements]);
            } else {
                jobArrCombind([JobbElements, JobLstArr]);
            }
            arrayToText(JobbArr);

        } else if (nextPagePrompt.toLocaleLowerCase() === 'nej') {
            break;
        } else if (!isNaN(parseInt(nextPagePrompt))) {
            let jobNum: number = parseInt(nextPagePrompt) - 1;
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

//Function call has to be commented out or removed for tests to work
//normaliseInput();