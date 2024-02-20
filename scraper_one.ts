import * as promptSync  from 'prompt-sync'
import axios from "axios";
import * as cheerio from "cheerio"
import { attr } from "cheerio/lib/api/attributes";
import { find } from "cheerio/lib/api/traversing";

//console.log(axios.isCancel('something'));
const h2Elements: Array<string> = [];

const prompt = promptSync();
//const job = prompt("vilket jobb: ")
//let result = prompt("vilken vill du börja på: ")
function main(x:string, y:string): Promise<void>{
    return new Promise((resolve) =>{
        if (y === 'alla'){
            axios({
                method: 'get', 
                url: `https://jobb.blocket.se/lediga-jobb-i-hela-sverige/sida${x}/`,
            })
            .then(response => {
                const $ = cheerio.load(response.data);
                $("div a h3").each((index, element) => {
                    h2Elements.push($(element).text());
            });
            resolve()
            });
        }
        else{
            axios({
                method: 'get', 
                url: `https://jobb.blocket.se/lediga-jobb-i-hela-sverige/sida${x}/?ks=freetext.${y}`,
            })  
            .then(response => {
                const $ = cheerio.load(response.data);   
                $("div a h3").each((index, element) => {
                    h2Elements.push($(element).text());
            });
            resolve()
            });
        }})
    } 

async function func(): Promise<void>{
    while(true){
        const job = prompt("vilket jobb: ")
        let result = prompt("vilken vill du börja på: ")
        let question = prompt("vilken sida vill du sluta på: ")
        for(let a = +result; a <= +question; a++){
            await main(result,job)
            const w = (+result) + 1
            result = w.toString()
        }
        console.log(h2Elements)
        break;
    }
}
func()
