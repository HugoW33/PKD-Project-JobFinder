const mockInput= jest.fn()
jest.mock('prompt-sync', () => () => mockInput);

import { main as main1, JobbElements, main} from "./scraper_one";
import { retrieveHeaderUrls as main2 } from "./main2";
import { normaliseInput, JobbArr, toggleTestMode} from "./main";
import * as cheerio from 'cheerio'
import axios from "axios";
import * as promptSync from 'prompt-sync';
import { data } from "cheerio/lib/api/attributes";
import { elementIsDisabled, titleContains } from "selenium-webdriver/lib/until";

toggleTestMode(true);

afterEach(() => {
    jest.clearAllMocks();
});

test('Test for one page of jobs', async () => {
    const spyFn = jest.spyOn(console, 'log')
        mockInput
        .mockReturnValue('nej')
        .mockReturnValueOnce('mekaniker uppsala');
    
        return await normaliseInput().then(() => {
           //console.log('SpyFn out: ', spyFn.mock.lastCall?.toString())
           //console.log('Mock return value: ', mockInput())   
            expect(spyFn).toHaveBeenCalledTimes(JobbArr.length)
        });
});

test('Test for correct output when no mre jobs exist', async () => {
    const spyFn = jest.spyOn(console, 'log');
    mockInput
    .mockReturnValue('ja')
    .mockReturnValueOnce('mekaniker uppsala')
    await normaliseInput().then(() => {
        expect(spyFn).toHaveBeenCalledWith('Inga fler jobb !')
    });
}, 10000);

test('Test for an invalid answer', async () => {
    const spyFn = jest.spyOn(console, 'log');
    mockInput
    .mockReturnValue('nej')
    .mockReturnValueOnce('mekaniker uppsala')
    .mockReturnValueOnce('test');

    return await normaliseInput().then(() => {
        expect(spyFn).toHaveBeenCalledWith('Inte ett giltigt svar!')
    })
}, 10000);

test('Test for number of jobs after 2 pages', async () => {
    const spyFn = jest.spyOn(console, 'log');
    console.clear()
    mockInput
    .mockReturnValue('nej')
    .mockReturnValueOnce('mekaniker alla')
    return await normaliseInput().then(() =>{
        expect(spyFn).toHaveBeenCalledTimes(50)
    })
}, 10000);

test('Test axios gives valid response', async () => {
    const response: string = await axios.get('https://jobb.blocket.se/ledigt-jobb-i-lulea/sts-sydhamnens-trailer-service-ab/mekaniker/2161143#1')
    expect(response).toBeTruthy();
});

test('Make sure that main1 resolves',async () => {
    expect(main1('1', 'mekaniker alla')).resolves;
});

test('the data of the function is an instance of a JobLst', async () => {
    return await main2('mekaniker uppsala', 1).then(data => {
        expect(data).
        toBeInstanceOf(Array<{title: string, stad: string, url: string}>);
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
        expect(JobbElements).
        toBeInstanceOf(Array<{title: string, stad: string, url: string}>);
    });
});