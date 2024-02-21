import * as promptSync  from 'prompt-sync'
import axios from "axios";
import * as cheerio from "cheerio"
import { attr } from "cheerio/lib/api/attributes";
import { find } from "cheerio/lib/api/traversing";
type JobbLst = Array<{ title: string, stad:string, url: string}>


const prompt = promptSync();
const JobbElements: JobbLst = [];

//webscraper function
//@return{promise<void>} - ger ingen return, ändrar JobbElements och signalerar att den är klar
//@param{sida} - vilket sidanummer som datan ska hämtas ifrån
//@param{jobb} - vilket jobb som skall sökas efter
//@param{city} - vilken stad man vill söka i
//@precondition - att sidan, staden samt jobbet finns på hemsidan
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
                const title = $(element).text();
                const url = $(element).parent().attr('href') || '';
                let stad = ''
                $(element).parent().parent().find("a").each((index, element) =>{
                    if (index === 2){
                        stad = $(element).text();
                    }    
                }); 
                JobbElements.push({ title, stad, url });
            });
        resolve();
        });
    });
};

//funktionen som gör att man kan köra main
async function RunFunc(): Promise<void>{
    let job = prompt("vilket jobb och stad: ");
    let page = prompt("vilken vill du börja på: ");
    let question = prompt("vilken sida vill du sluta på: ");
    for(let a = +page; a <= +question; a++){
        await main(page.toLocaleLowerCase(),job.toLocaleLowerCase());
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
        let yn = prompt("vill du se en sida till? (ja/nej): ")
        if(yn.toLocaleLowerCase() === "ja"){
            const num = (+page) + 1;
            page = num.toString();
            await main(page.toLocaleLowerCase(),job.toLocaleLowerCase());
            console.log(JobbElements);
        }
        else if(yn.toLocaleLowerCase() === "nej"){
            break;
        }
        else{
            console.log("oj! fel input");
        }
    }
    
}
RunFunc();
