"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIn = void 0;
var readline = require("readline");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var validSites = ['Arbetsförmedlingen', 'Blocket'];
function getUserIn() {
    rl.question('Vilken sida vill du söka jobb på: ', function (answer) {
        rl.close();
        return answer;
    });
}
exports.getUserIn = getUserIn;
console.log(getUserIn());
