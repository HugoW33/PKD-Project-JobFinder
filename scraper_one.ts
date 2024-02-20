import * as promptSync  from 'prompt-sync'
import axios from "axios";
import * as cheerio from "cheerio"
import { attr } from "cheerio/lib/api/attributes";
import { find } from "cheerio/lib/api/traversing";

//console.log(axios.isCancel('something'));
const h2Elements: Array<any> = [];

const prompt = promptSync();
const result = prompt("vilken sida: ")
function main(x:string){
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

main(result)

