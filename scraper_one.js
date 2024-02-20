"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var promptSync = require("prompt-sync");
var axios_1 = require("axios");
var cheerio = require("cheerio");
//console.log(axios.isCancel('something'));
var h2Elements = [];
var prompt = promptSync();
var job = prompt("vilket jobb: ");
var result = prompt("vilken vill du börja på: ");
function main(x, y) {
    if (y === 'alla') {
        (0, axios_1.default)({
            method: 'get',
            url: "https://jobb.blocket.se/lediga-jobb-i-hela-sverige/sida".concat(x, "/"),
        })
            .then(function (response) {
            var $ = cheerio.load(response.data);
            $("div a h3").each(function (index, element) {
                h2Elements.push($(element).text());
            });
            return h2Elements;
        });
    }
    else {
        (0, axios_1.default)({
            method: 'get',
            url: "https://jobb.blocket.se/lediga-jobb-i-hela-sverige/sida".concat(x, "/?ks=freetext.").concat(y),
        })
            .then(function (response) {
            var $ = cheerio.load(response.data);
            $("div a h3").each(function (index, element) {
                h2Elements.push($(element).text());
            });
            return h2Elements;
        });
    }
}
while (true) {
    main(result, job);
    var question = prompt("vilken sida vill du sluta på: ");
    for (var a = +result; a <= +question; a++) {
        main(result, job);
        var w = (+result) + 1;
        result = w.toString();
    }
    console.log(h2Elements);
    break;
}
