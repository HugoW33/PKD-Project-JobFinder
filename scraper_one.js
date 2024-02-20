"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var promptSync = require("prompt-sync");
var axios_1 = require("axios");
var cheerio = require("cheerio");
//console.log(axios.isCancel('something'));
var h2Elements = [];
var prompt = promptSync();
var result = prompt("vilken sida: ");
function main(x) {
    (0, axios_1.default)({
        method: 'get',
        url: "https://jobb.blocket.se/lediga-jobb-i-hela-sverige/sida".concat(x, "/"),
    })
        .then(function (response) {
        var $ = cheerio.load(response.data);
        $("div a h3").each(function (index, element) {
            h2Elements.push($(element).text());
        });
        console.log(h2Elements);
    });
}
main(result);
