"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.JobbElements = void 0;
var promptSync = require("prompt-sync");
var axios_1 = require("axios");
var cheerio = require("cheerio");
var prompt = promptSync();
exports.JobbElements = [];
//webscraper function
//@return{promise<void>} - ger ingen return, ändrar JobbElements och signalerar att den är klar
//@param{sida} - vilket sidanummer som datan ska hämtas ifrån
//@param{jobbstad} - vilket jobb som skall sökas efter, och i vilken stad
//@precondition - att sidan, staden samt jobbet finns på hemsidan
function main(sida, jobbstad) {
    var stadarr = jobbstad.split(" ");
    var jobb = stadarr[0];
    var city = stadarr[1];
    return new Promise(function (resolve) {
        var url = "https://jobb.blocket.se/lediga-jobb-i-".concat(encodeURIComponent(city), "/sida").concat(encodeURIComponent(sida), "/?ks=freetext.").concat(encodeURIComponent(jobb));
        if (jobb === 'alla' && city === 'alla') {
            url = "https://jobb.blocket.se/lediga-jobb-i-hela-sverige/sida".concat(encodeURIComponent(sida), "/");
        }
        else if (jobb === 'alla') {
            url = "https://jobb.blocket.se/lediga-jobb-i-".concat(encodeURIComponent(city), "/sida").concat(encodeURIComponent(sida), "/");
        }
        else if (city === 'alla') {
            url = "https://jobb.blocket.se/lediga-jobb-i-hela-sverige/sida".concat(encodeURIComponent(sida), "/?ks=freetext.").concat(encodeURIComponent(jobb));
        }
        axios_1.default.get(url).then(function (response) {
            var $ = cheerio.load(response.data);
            $("div a h3").each(function (index, element) {
                var title = $(element).text();
                var url = $(element).parent().attr('href') || '';
                var stad = '';
                $(element).parent().parent().find("a").each(function (index, element) {
                    if (index === 2) {
                        stad = $(element).text();
                    }
                });
                title = title.replace('    ', '');
                exports.JobbElements.push({ title: title, stad: stad, url: url });
            });
            resolve();
        });
    });
}
exports.main = main;
;
//funktionen som gör att man kan köra main
function RunFunc() {
    return __awaiter(this, void 0, void 0, function () {
        var job, page, yn, num;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    job = prompt("vilket jobb och stad: ");
                    page = prompt("vilken vill du börja på: ");
                    return [4 /*yield*/, main(page.toLocaleLowerCase(), job.toLocaleLowerCase())];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 6];
                    exports.JobbElements.forEach(function (element, index) {
                        console.log("".concat(index + 1, ". ").concat(element.title, ", ").concat(element.stad));
                    });
                    yn = prompt("vill du se en sida till? (ja/nej): ");
                    if (!(yn.toLocaleLowerCase() === "ja")) return [3 /*break*/, 4];
                    num = (+page) + 1;
                    page = num.toString();
                    return [4 /*yield*/, main(page.toLocaleLowerCase(), job.toLocaleLowerCase())];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    if (yn.toLocaleLowerCase() === "nej") {
                        return [3 /*break*/, 6];
                    }
                    else {
                        console.log("oj! fel input");
                    }
                    _a.label = 5;
                case 5: return [3 /*break*/, 2];
                case 6: return [2 /*return*/];
            }
        });
    });
}
//RunFunc();
