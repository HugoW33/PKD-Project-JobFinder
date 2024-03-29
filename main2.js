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
exports.displayRequirements = exports.retrieveHeaderUrls = exports.JobLstArr = void 0;
var selenium_webdriver_1 = require("selenium-webdriver");
var chrome_1 = require("selenium-webdriver/chrome");
/**
 * Creates an asynchronous delay for a specified amount of time.
 *
 * @param ms - number. The duration of the delay in milliseconds.
 * @returns A Promise that resolves after the specified delay.
 *
 * @preconditions
 *   * The provided `ms` value is a non-negative number.
 */
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
exports.JobLstArr = [];
/**
 * Asynchronously retrieves job listing header titles and their corresponding
 * URLs from Arbetsförmedlingen, based on a provided search query and page number.
 *
 * @param searchQuery - string. The search term to use for querying job listings.
 * @param pageNumber - number.  The page number of the search results to retrieve.
 * @returns - Promise<JobbLst> A Promise that resolves to a JobbLst object, containing
 *            arrays of job listing headers and their associated URLs.
 * @preconditions
 * pageNumber must be a non-negative number.
 */
function retrieveHeaderUrls(searchQuery, pageNumber) {
    return __awaiter(this, void 0, void 0, function () {
        var chromeOptions, driver, headerElements, _i, headerElements_1, headerElement, headerText, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chromeOptions = new chrome_1.Options();
                    chromeOptions.addArguments("--headless");
                    return [4 /*yield*/, new selenium_webdriver_1.Builder()
                            .forBrowser("chrome")
                            .setChromeOptions(chromeOptions)
                            .withCapabilities(selenium_webdriver_1.Capabilities.chrome())
                            .build()];
                case 1:
                    driver = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 11, 13]);
                    // Navigate to the webpage
                    return [4 /*yield*/, driver.get("https://arbetsformedlingen.se/platsbanken/annonser?q=".concat(encodeURIComponent(searchQuery), "&page=").concat(pageNumber))];
                case 3:
                    // Navigate to the webpage
                    _a.sent();
                    return [4 /*yield*/, delay(500)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, driver.findElements(selenium_webdriver_1.By.css("h3 a"))];
                case 5:
                    headerElements = _a.sent();
                    _i = 0, headerElements_1 = headerElements;
                    _a.label = 6;
                case 6:
                    if (!(_i < headerElements_1.length)) return [3 /*break*/, 10];
                    headerElement = headerElements_1[_i];
                    return [4 /*yield*/, headerElement.getText()];
                case 7:
                    headerText = _a.sent();
                    return [4 /*yield*/, headerElement.getAttribute("href")];
                case 8:
                    url = _a.sent();
                    if (headerText && url) { // Check for null values
                        exports.JobLstArr.push({ title: headerText, stad: '', url: url });
                    }
                    _a.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 6];
                case 10: return [2 /*return*/, exports.JobLstArr];
                case 11: return [4 /*yield*/, driver.quit()];
                case 12:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.retrieveHeaderUrls = retrieveHeaderUrls;
/**
 * Asynchronously extracts job requirements from a given URL and returns the requirements as an array of objects.
 *
 * @param url - string. The URL of the job posting page.
 * @returns - Promise. A Promise that resolves to an array of objects, where each object represents
 *          a job requirement and contains a `header` property with the requirement's text.
 *
 */
function displayRequirements(url) {
    return __awaiter(this, void 0, void 0, function () {
        var chromeOptions, driver, requirements, reqString, _i, requirements_1, req, reqText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chromeOptions = new chrome_1.Options();
                    chromeOptions.addArguments("--headless");
                    return [4 /*yield*/, new selenium_webdriver_1.Builder()
                            .forBrowser("chrome")
                            .setChromeOptions(chromeOptions)
                            .withCapabilities(selenium_webdriver_1.Capabilities.chrome())
                            .build()];
                case 1:
                    driver = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 10, 12]);
                    return [4 /*yield*/, driver.get(url)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, delay(500)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, driver.findElements(selenium_webdriver_1.By.xpath('//*[@id="pb-root"]/pb-page-job/div/section/div/div[2]/div[2]/section/div/pb-feature-job-qualifications/div/pb-section-job-qualification'))];
                case 5:
                    requirements = _a.sent();
                    reqString = [];
                    _i = 0, requirements_1 = requirements;
                    _a.label = 6;
                case 6:
                    if (!(_i < requirements_1.length)) return [3 /*break*/, 9];
                    req = requirements_1[_i];
                    return [4 /*yield*/, req.getText()];
                case 7:
                    reqText = _a.sent();
                    if (reqText) { // Check for null values
                        reqString.push({ header: reqText });
                    }
                    _a.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9: return [2 /*return*/, reqString];
                case 10: return [4 /*yield*/, driver.quit()];
                case 11:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
}
exports.displayRequirements = displayRequirements;
