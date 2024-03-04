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
exports.normaliseInput = exports.jobArrCombind = exports.allJobsLst = exports.JobbArr = void 0;
var scraper_one_1 = require("./scraper_one");
var promptSync = require("prompt-sync");
var main2_1 = require("./main2");
exports.JobbArr = [];
var prompt = promptSync();
//Array with type jobLst used to print out relevant information that is not
//displayed to the user
exports.allJobsLst = [];
//Function that combines diffrant JobbLst 
//@return{void} - Doesent return anything
//@param{arr} - Array<JobbLst> containing the JobbLst's to be combined
//@precondition - The imput fufils the type requirements
function jobArrCombind(arr) {
    var numberOfJobsPerPage = 0;
    for (var i = 0; i < arr.length; i++) {
        var _loop_1 = function (jobLsting) {
            var exists = false;
            exports.allJobsLst.forEach(function (element) {
                if (element.url === jobLsting.url) {
                    exists = true;
                }
            });
            if (exists) {
                return "continue";
            }
            if (jobLsting.stad !== '') {
                exports.JobbArr.push("".concat(exports.JobbArr.length + 1, ": ").concat(jobLsting.title, " i ").concat(jobLsting.stad));
                exports.allJobsLst.push({ title: jobLsting.title, stad: jobLsting.stad,
                    url: jobLsting.url });
            }
            else {
                exports.JobbArr.push("".concat(exports.JobbArr.length + 1, ": ").concat(jobLsting.title));
                exports.allJobsLst.push({ title: jobLsting.title, stad: jobLsting.stad,
                    url: jobLsting.url });
            }
            numberOfJobsPerPage++;
            if (numberOfJobsPerPage >= 25) {
                return { value: void 0 };
            }
        };
        for (var _i = 0, _a = arr[i]; _i < _a.length; _i++) {
            var jobLsting = _a[_i];
            var state_1 = _loop_1(jobLsting);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    }
}
exports.jobArrCombind = jobArrCombind;
//Text function
//@return{void} - Doesent return anything, only console.log's
//@param{arr} - A array<string> with n elements to be printed
//@precondition - if the array is empty nothing happens. 
function arrayToText(arr) {
    for (var i = 0; i < arr.length; i++) {
        console.log("\n ".concat(arr[i]));
    }
}
//Main runing function
//@return{promise<void>} - doesent return anything, resolves a prommise
//@precondition - The imputs provided by the user are of the type that the prompt asks for
function normaliseInput() {
    return __awaiter(this, void 0, void 0, function () {
        var job, page, nextPagePrompt, lastIndex, jobNum, reqs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    job = prompt("vilket jobb och stad: ");
                    if (job === undefined) {
                        console.log('Oj, något gick fel!');
                    }
                    page = 1;
                    //let question = prompt("vilken sida vill du sluta på: ");
                    return [4 /*yield*/, (0, scraper_one_1.main)(page.toString(), job.toLocaleLowerCase())];
                case 1:
                    //let question = prompt("vilken sida vill du sluta på: ");
                    _a.sent();
                    return [4 /*yield*/, (0, main2_1.retrieveHeaderUrls)(job.toLocaleLowerCase(), page)];
                case 2:
                    _a.sent();
                    // const NumPage = (+page) + 1;
                    // page = NumPage;
                    // console.log(JobbElements);
                    jobArrCombind([scraper_one_1.JobbElements, main2_1.JobLstArr]);
                    //console.log(JobbArr);
                    arrayToText(exports.JobbArr);
                    _a.label = 3;
                case 3:
                    if (!true) return [3 /*break*/, 13];
                    nextPagePrompt = prompt('vill du se en sida till? (ja/nej) eller vill du visa ett jobb (svara med annaonsens siffra): ');
                    if (!(nextPagePrompt.toLocaleLowerCase() === 'ja')) return [3 /*break*/, 8];
                    lastIndex = main2_1.JobLstArr.slice(-1);
                    page += 1;
                    return [4 /*yield*/, (0, main2_1.retrieveHeaderUrls)(job.toLocaleLowerCase(), page)];
                case 4:
                    _a.sent();
                    if (scraper_one_1.JobbElements.length % 13 !== 0 && lastIndex[0].url === main2_1.JobLstArr.slice(-1)[0].url) {
                        console.error('Inga fler jobb !');
                        return [3 /*break*/, 3];
                    }
                    if (!(scraper_one_1.JobbElements.length % 13 === 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, scraper_one_1.main)(page.toString(), job.toLocaleLowerCase())];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    console.error('Inga fler jobb på blocket !!');
                    jobArrCombind([main2_1.JobLstArr]);
                    _a.label = 7;
                case 7:
                    //const num = page + 1;
                    if (lastIndex[0].url === main2_1.JobLstArr.slice(-1)[0].url) {
                        console.error('Inga fler jobb på Arbetsförmedlingen');
                        jobArrCombind([scraper_one_1.JobbElements]);
                    }
                    else {
                        jobArrCombind([scraper_one_1.JobbElements, main2_1.JobLstArr]);
                    }
                    arrayToText(exports.JobbArr);
                    return [3 /*break*/, 12];
                case 8:
                    if (!(nextPagePrompt.toLocaleLowerCase() === 'nej')) return [3 /*break*/, 9];
                    return [3 /*break*/, 13];
                case 9:
                    if (!!isNaN(parseInt(nextPagePrompt))) return [3 /*break*/, 11];
                    jobNum = parseInt(nextPagePrompt) - 1;
                    return [4 /*yield*/, (0, main2_1.displayRequirements)(exports.allJobsLst[jobNum].url)];
                case 10:
                    reqs = _a.sent();
                    if (exports.allJobsLst[jobNum].url.includes('jobb.blocket')) {
                        console.log("Se anonnsen f\u00F6r krav: \n".concat(exports.allJobsLst[jobNum].url));
                    }
                    else {
                        console.log("Annons: ".concat(exports.allJobsLst[jobNum].url));
                        reqs.forEach(function (reqs) {
                            console.log(reqs.header);
                        });
                    }
                    return [3 /*break*/, 12];
                case 11:
                    console.log('Inte ett giltigt svar!');
                    _a.label = 12;
                case 12: return [3 /*break*/, 3];
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.normaliseInput = normaliseInput;
//normaliseInput();
