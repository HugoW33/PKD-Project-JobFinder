import { Builder, By, Capabilities, WebDriver } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";
import * as readline from 'readline';

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function retrieveHeaderUrls(searchQuery: string, pageNumber: number): Promise<{ header: string, url: string }[]> {
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
        await delay(1000);
        // Retrieve all headers with URLs
        const headerElements = await driver.findElements(By.css("h3 a"));
        //
        // Extract header text and URL
        const headersWithUrls: { header: string, url: string }[] = [];
        for (const headerElement of headerElements) {
            const headerText = await headerElement.getText();
            const url = await headerElement.getAttribute("href");
            if (headerText && url) { // Check for null values
                headersWithUrls.push({ header: headerText, url: url });
            }
        }

        return headersWithUrls;
    } finally {
        await driver.quit();
    }
}

// Function to get user input
function prompt(question: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();
            resolve(answer);
        });
    });
}

async function displayRequirements(url:string): Promise<{ header: string}[]> {
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
        await delay(1000);
        const requirements = await driver.findElements(By.css("h2"));
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

async function main() {
    let searchQuery = await prompt("Enter your search query: ");
    let pageNumber = 1; 

    while (true) {
        // Retrieve headers and URLs for the current page
        const headersWithUrls = await retrieveHeaderUrls(searchQuery, pageNumber);
        console.log(`Headers with URLs (Page ${pageNumber}):`);
        headersWithUrls.forEach((headerWithUrl, index) => {
            console.log(`${index + 1}. ${headerWithUrl.header}`);
        });

        // Prompt user to choose an option
        const option = await prompt("Enter the number of the link to view its contents, or type 'next' to go to the next page: ");
        if (option.toLowerCase() === "next") {
            pageNumber++;
        } else {
            const selectedLinkIndex = parseInt(option) - 1;
            const selectedLink = headersWithUrls[selectedLinkIndex];
            if (selectedLink) {
                console.log(`Selected link: ${selectedLink.header}`);
                // Now you can navigate to the selected link and extract its contents
                // For simplicity only utput the URL for now TODO
                displayRequirements(selectedLink.url);
                console.log(`URL: ${selectedLink.url}`);
            } else {
                console.log("Invalid option.");
            }
        }

        // Prompt user to continue or exit
        const nextPagePrompt = await prompt("Do you want to continue to the next page? (yes/no): ");
        if (nextPagePrompt.toLowerCase() !== "yes") {
            break; // Exit loop if the user does not want to proceed to the next page
        }
    }
}

main();
