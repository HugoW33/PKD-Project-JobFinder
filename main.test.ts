
const mockInput= jest.fn()
jest.mock('prompt-sync', () => () => mockInput);

import { main as main1, JobbElements} from "./scraper_one";
import type { JobbLst } from "./scraper_one";
import { retrieveHeaderUrls as main2, JobLstArr } from "./main2";
import { normaliseInput, jobArrCombind, JobbArr } from "./main";

import { data } from "cheerio/lib/api/attributes";
import axios from "axios";


beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
})

test('Check that the final array has the correct length', async () => {
    const spyFn = jest.spyOn(console, 'log')
    mockInput
    .mockReturnValue('nej')
    .mockReturnValueOnce('mekaniker uppsala');
    console.log(mockInput.mock.calls)
    console.log(mockInput.mock.results)
    return await normaliseInput().then(() => {
        expect(spyFn).toHaveBeenCalledTimes(JobbArr.length + 2)
    })
});

test('the data of the function is an instance of a JobLst', async () => {
    return await main2('mekaniker uppsala', 1).then(data => {
        expect(data).toBeInstanceOf(Array<{title: string, stad: string, url: string}>);
    });
});

test('check if an error occured', async () => {
    try {
        await main2('mekaniker uppsala', 20);
    } catch (error) {
        expect(error).toMatch('error');
        console.error(error);
    }
});

test('Test if main1 gives a return value', async () => {
    return await main1('1', 'mekaniker uppsala').then(data => {
        expect(data).toBeFalsy();
    });
});

test('Test the return value of main1 function', async () => {
    return await main1('1', 'mekaniker uppsala').then(data => {
        expect(JobbElements).toBeInstanceOf(Array<{title: string, stad: string, url: string}>);
    });
});