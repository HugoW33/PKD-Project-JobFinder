import * as promptSync  from 'prompt-sync'
import axios from "axios";
import * as cheerio from "cheerio"
import { attr } from "cheerio/lib/api/attributes";
import { find } from "cheerio/lib/api/traversing";

//console.log(axios.isCancel('something'));
const h2Elements: Array<string> = [];

const prompt = promptSync();
const job = prompt("vilket jobb: ")
const result = prompt("vilken sida: ")
function main(x:string, y:string): void{
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
            console.log(h2Elements)
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
        if(h2Elements.length === 1){
            console.log('inga jobb hittades')
        }else{
            console.log(h2Elements)
        }
        });
    }
} 


main(result, job)

