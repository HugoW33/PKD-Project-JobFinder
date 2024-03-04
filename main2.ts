import { Builder, By, Capabilities, WebDriver } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";
import * as readline from 'readline';

import { type JobbLst } from "./scraper_one";


/**
 * Creates an asynchronous delay for a specified amount of time.
 *
 * @param ms - number. The duration of the delay in milliseconds.
 * @returns A Promise that resolves after the specified delay.
 *
 * @preconditions
 *   * The provided `ms` value is a non-negative number. 
 */

function delay(ms: number) : Promise<void>{
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const JobLstArr: JobbLst = [];
/**
 * Asynchronously retrieves job listing header titles and their corresponding 
 * URLs from Arbetsförmedlingen, based on a provided search query and page number.
 * 
 * @param searchQuery - string. The search term to use for querying job listings.
 * @param pageNumber - number.  The page number of the search results to retrieve.
 * @returns - Promise<JobbLst> A Promise that resolves to a JobbLst object, containing 
 *            arrays of job listing headers and their associated URLs.
 * @preconditions
 * pageNumber must be a non-negative number.
 */

export async function retrieveHeaderUrls(searchQuery: string, pageNumber: number): Promise<JobbLst> {
    const chromeOptions = new Options();
    chromeOptions.addArguments("--headless");
    
    // Setup Chrome driver
    const driver: WebDriver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(chromeOptions)
        .withCapabilities(Capabilities.chrome())
        .build();

    try {
        // Navigate to the webpage
        await driver.get(`https://arbetsformedlingen.se/platsbanken/annonser?q=${encodeURIComponent(searchQuery)}&page=${pageNumber}`);
        await delay(500);
        // Retrieve all headers with URLs
        const headerElements = await driver.findElements(By.css("h3 a"));
        //
        // Extract header text and URL
        for (const headerElement of headerElements) {
            const headerText = await headerElement.getText();
            const url = await headerElement.getAttribute("href");
            if (headerText && url) { // Check for null values
                JobLstArr.push({ title: headerText, stad: '', url: url });
            }
        }

        return JobLstArr;
    } finally {
        await driver.quit();
    }
}

/**
 * Asynchronously extracts job requirements from a given URL and returns the requirements as an array of objects.
 *
 * @param url - string. The URL of the job posting page.
 * @returns - Promise. A Promise that resolves to an array of objects, where each object represents 
 *          a job requirement and contains a `header` property with the requirement's text. 
 * 
 */
export async function displayRequirements(url:string): Promise<{ header: string}[]> {
    const chromeOptions = new Options();
    chromeOptions.addArguments("--headless");

    // Setup Chrome driver
    const driver: WebDriver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(chromeOptions)
        .withCapabilities(Capabilities.chrome())
        .build();

    try {
        await driver.get(url);
        await delay(500);
        const requirements = await driver.findElements(By.xpath('//*[@id="pb-root"]/pb-page-job/div/section/div/div[2]/div[2]/section/div/pb-feature-job-qualifications/div/pb-section-job-qualification'));
        const reqString: { header: string}[] = [];
    
        for (const req of requirements) {
            const reqText = await req.getText();
            if (reqText) { // Check for null values

                reqString.push({ header: reqText});

            }
        }
        return reqString;
    }

    finally {
        await driver.quit();
    }
}




