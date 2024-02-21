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
var scraper_one_1 = require("./scraper_one");
var promptSync = require("prompt-sync");
var main2_1 = require("./main2");
var JobbArr = [];
var prompt = promptSync();
function normaliseInput() {
    return __awaiter(this, void 0, void 0, function () {
        var i, job, page, question, a, NumPage, allJobsLst, i_1, i_2, nextPagePrompt, num, i_3, i_4, jobNum, cringe;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    job = prompt("vilket jobb och stad: ");
                    page = prompt("vilken vill du börja på: ");
                    question = prompt("vilken sida vill du sluta på: ");
                    a = +page;
                    _a.label = 1;
                case 1:
                    if (!(a <= +question)) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, scraper_one_1.main)(page.toLocaleLowerCase(), job.toLocaleLowerCase())];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, main2_1.retrieveHeaderUrls)(job.toLocaleLowerCase(), +page.toLocaleLowerCase())];
                case 3:
                    _a.sent();
                    if (a === +question) {
                        return [3 /*break*/, 5];
                    }
                    else {
                        NumPage = (+page) + 1;
                        page = NumPage.toString();
                    }
                    _a.label = 4;
                case 4:
                    a++;
                    return [3 /*break*/, 1];
                case 5:
                    allJobsLst = [];
                    for (i_1 = JobbArr.length + 1; i_1 < scraper_one_1.JobbElements.length; i_1++) {
                        JobbArr.push("".concat(i_1, ": ").concat(scraper_one_1.JobbElements[i_1].title, " i ").concat(scraper_one_1.JobbElements[i_1].stad));
                        allJobsLst.push({ title: scraper_one_1.JobbElements[i_1].title, stad: scraper_one_1.JobbElements[i_1].stad,
                            url: scraper_one_1.JobbElements[i_1].url });
                    }
                    for (i_2 = JobbArr.length; i_2 < main2_1.JobLstArr.length; i_2++) {
                        JobbArr.push("".concat(i_2, ": ").concat(main2_1.JobLstArr[i_2].title));
                        allJobsLst.push({ title: main2_1.JobLstArr[i_2].title, stad: main2_1.JobLstArr[i_2].stad,
                            url: main2_1.JobLstArr[i_2].url });
                    }
                    console.log(JobbArr);
                    _a.label = 6;
                case 6:
                    if (!true) return [3 /*break*/, 14];
                    nextPagePrompt = prompt('vill du se en sida till? (ja/nej) eller vill du visa ett jobb (svara med annaonsens siffra): ');
                    if (!(nextPagePrompt.toLocaleLowerCase() === 'ja')) return [3 /*break*/, 9];
                    num = (+page) + 1;
                    page = num.toString();
                    return [4 /*yield*/, (0, scraper_one_1.main)(page.toLocaleLowerCase(), job.toLocaleLowerCase())];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, (0, main2_1.retrieveHeaderUrls)(job.toLocaleLowerCase(), +page)];
                case 8:
                    _a.sent();
                    for (i_3 = JobbArr.length; i_3 < scraper_one_1.JobbElements.length; i_3++) {
                        JobbArr.push("".concat(i_3, ": ").concat(scraper_one_1.JobbElements[i_3].title, " i ").concat(scraper_one_1.JobbElements[i_3].stad));
                        allJobsLst.push({ title: scraper_one_1.JobbElements[i_3].title, stad: scraper_one_1.JobbElements[i_3].stad,
                            url: scraper_one_1.JobbElements[i_3].url });
                    }
                    for (i_4 = JobbArr.length; i_4 < main2_1.JobLstArr.length; i_4++) {
                        JobbArr.push("".concat(i_4, ": ").concat(main2_1.JobLstArr[i_4].title));
                        allJobsLst.push({ title: main2_1.JobLstArr[i_4].title, stad: main2_1.JobLstArr[i_4].stad,
                            url: main2_1.JobLstArr[i_4].url });
                    }
                    console.log(JobbArr);
                    return [3 /*break*/, 13];
                case 9:
                    if (!(nextPagePrompt.toLocaleLowerCase() === 'nej')) return [3 /*break*/, 10];
                    return [3 /*break*/, 14];
                case 10:
                    if (!!isNaN(parseInt(nextPagePrompt))) return [3 /*break*/, 12];
                    jobNum = parseInt(nextPagePrompt);
                    console.log(allJobsLst[jobNum].url);
                    return [4 /*yield*/, (0, main2_1.displayRequirements)(allJobsLst[jobNum].url)];
                case 11:
                    cringe = _a.sent();
                    if (allJobsLst[jobNum].url.includes('jobb.blocket')) {
                        console.log("Se l\u00E4nk: \n".concat(allJobsLst[jobNum].url));
                    }
                    cringe.forEach(function (cringe) {
                        console.log(cringe.header);
                    });
                    return [3 /*break*/, 13];
                case 12:
                    console.log('Inte ett giltigt svar!');
                    _a.label = 13;
                case 13: return [3 /*break*/, 6];
                case 14: return [2 /*return*/];
            }
        });
    });
}
normaliseInput();
