import { get } from 'cheerio/lib/api/traversing';
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const validSites: Array<string> = ['Arbetsförmedlingen', 'Blocket'];

export function getUserIn(): string | void {
    console.log(`Tillgängliga sidor: ${validSites.toString()}`);
    rl.question('Vilken sida vill du söka jobb på: ', answer => {
        if (!validSites.includes(answer)) {
            console.log('Inte en giltig sida att söka jobb på!');
            rl.close();
        } else {
            console.log(`Vald sida: ${answer}`);
            const ans: string = answer;
            rl.close();
            return ans;
        }
        rl.close();
    });

}

getUserIn();

