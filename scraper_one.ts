import * as promptSync  from 'prompt-sync'
import axios from "axios";
import * as cheerio from "cheerio"
import { attr } from "cheerio/lib/api/attributes";
import { find } from "cheerio/lib/api/traversing";
const prompt = promptSync();
const JobbElements: Array<string> = [];


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
                    JobbElements.push($(element).text());
            });
            resolve();
            });
    });
};
     

async function func(): Promise<void>{
    while(true){
        const job = prompt("vilket jobb: ");
        const stad = prompt("vilken stad: ");
        let page = prompt("vilken vill du börja på: ");
        let question = prompt("vilken sida vill du sluta på: ");
        for(let a = +page; a <= +question; a++){
            await main(page,job,stad);
            const NumPage = (+page) + 1;
            page = NumPage.toString();
        }
        console.log(JobbElements);
        break;
    }
}
func();
