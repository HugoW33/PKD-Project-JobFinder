import * as promptSync  from 'prompt-sync'
import axios from "axios";
import * as cheerio from "cheerio"
import { attr } from "cheerio/lib/api/attributes";
import { find } from "cheerio/lib/api/traversing";
type JobbLst = Array<{ title: string, url: string}>


const prompt = promptSync();
const JobbElements: JobbLst = [];


function main(sida:string, jobb:string, city:string): Promise<void>{
    return new Promise((resolve) =>{
        let url = `https://jobb.blocket.se/lediga-jobb-i-${city}/sida${sida}/?ks=freetext.${jobb}`;
        if (jobb === 'alla' && city === 'alla'){
            url = `https://jobb.blocket.se/lediga-jobb-i-hela-sverige/sida${sida}/`;
        }
        else if (jobb === 'alla'){
            url = `https://jobb.blocket.se/lediga-jobb-i-${city}/sida${sida}/`;
        }
        else if (city === 'alla'){
            url = `https://jobb.blocket.se/lediga-jobb-i-hela-sverige/sida${sida}/?ks=freetext.${jobb}`;   
        }
          axios.get(url)
            .then(response => {
                const $ = cheerio.load(response.data);
                $("div a h3").each((index, element) => {
                    const title = $(element).text();
                    const url = $(element).parent().attr('href') || '';
                    JobbElements.push({ title, url });
                });
            resolve();
            });
    });
};
     

async function RunFunc(): Promise<void>{
    const job = prompt("vilket jobb: ");
    const stad = prompt("vilken stad: ");
    let page = prompt("vilken vill du börja på: ");
    let question = prompt("vilken sida vill du sluta på: ");
    for(let a = +page; a <= +question; a++){
        await main(page,job,stad);
        if (a === +question){
            break;
        }
        else{
            const NumPage = (+page) + 1;
            page = NumPage.toString();
        }
    }
    console.log(JobbElements);
    while(true){
        let yn = prompt("vill du se en sida till? (ja/nej):")
        if(yn === "ja"){
            const num = (+page) + 1;
            page = num.toString();
            await main(page,job,stad);
            console.log(JobbElements);
        }
        else if(yn === "nej"){
            break;
        }
        else{
            console.log("oj! fel input");
        }
    }
    
}

RunFunc();
