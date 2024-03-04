import * as promptSync  from 'prompt-sync'
import axios from "axios";
import * as cheerio from "cheerio"
import { attr } from "cheerio/lib/api/attributes";
import { find } from "cheerio/lib/api/traversing";

//type to handle the data we want to save
//
export type JobbLst = Array<{ title: string, stad:string, url: string}>


const prompt = promptSync();
export const JobbElements: JobbLst = [];

//webscraper function
//@return{promise<void>} - Doesent have any retrun value, changes JobbElements and resloves a promise
//@param{sida} - Witch page we are on
//@param{jobbstad} - Witch city and job we want to search for
//@precondition - That the page exists, as well as 'jobbstad' is enterd 
// with the job first and city after with a space between
export function main(sida:string, jobbstad: string): Promise<void>{
    const stadarr = jobbstad.split(" ");
    const jobb = stadarr[0]
    const city = stadarr[1]
    return new Promise((resolve) =>{
        let url = `https://jobb.blocket.se/lediga-jobb-i-${encodeURIComponent(city)}/sida${encodeURIComponent(sida)}/?ks=freetext.${encodeURIComponent(jobb)}`;
        if (jobb === 'alla' && city === 'alla'){
            url = `https://jobb.blocket.se/lediga-jobb-i-hela-sverige/sida${encodeURIComponent(sida)}/`;
        }
        else if (jobb === 'alla'){
            url = `https://jobb.blocket.se/lediga-jobb-i-${encodeURIComponent(city)}/sida${encodeURIComponent(sida)}/`;
        }
        else if (city === 'alla'){
            url = `https://jobb.blocket.se/lediga-jobb-i-hela-sverige/sida${encodeURIComponent(sida)}/?ks=freetext.${encodeURIComponent(jobb)}`;   
        }
        axios.get(url).then(response => {
            const $ = cheerio.load(response.data);
            $("div a h3").each((index, element) => {
                let title = $(element).text();
                const url = $(element).parent().attr('href') || '';
                let stad = ''
                $(element).parent().parent().find("a").each((index, element) =>{
                    if (index === 2){
                        stad = $(element).text();
                    }    
                });
                title = title.replace('    ', '') 
                JobbElements.push({ title, stad, url });
            });
        resolve();
        });
    });
};

//test function for main function
async function RunFunc(): Promise<void>{
    let job = prompt("vilket jobb och stad: ");
    let page = prompt("vilken vill du börja på: ");
    await main(page.toLocaleLowerCase(),job.toLocaleLowerCase());
    while(true){
        JobbElements.forEach((element, index)=>{
            console.log(`${index + 1}. ${element.title}, ${element.stad}`)
        })
        let yn = prompt("vill du se en sida till? (ja/nej): ")
        if(yn.toLocaleLowerCase() === "ja"){
            const num = (+page) + 1;
            page = num.toString();
            await main(page.toLocaleLowerCase(),job.toLocaleLowerCase());
        }
        else if(yn.toLocaleLowerCase() === "nej"){
            break;
        }
        else{
            console.log("oj! fel input");
        }
    }
    
}

