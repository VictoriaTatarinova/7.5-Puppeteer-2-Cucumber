const {Given, When, Then, Before, After} = require("@cucumber/cucumber");
const puppeteer = require("puppeteer");
const {expect} = require("chai");
const {showCode, chooseAndClickChair, book, chooseDay, chooseTimeAndFilm, checkUrl, codeIsVisible} = require ("../../lib/commands");
const {getTomorrowDay} = require("../../lib/util");
var {setDefaultTimeout} = require("@cucumber/cucumber");
setDefaultTimeout(60 * 1000);

         Before(async function() {
            const browser = await puppeteer.launch({headless: false, slowMo: 400});
            const page = await browser.newPage();
            this.browser = browser;
            this.page = page;
         });

         After(async function() {
            if (this.browser) {
                await this.browser.close();
            }
        });

         Given('user is on start page {string}', async function (string) {
            return await this.page.goto(string);
        });
        
         When('user choose day {string}', async function (string) {
          let day = await null;
              if (await string == "Tomorrow") {
               day = await getTomorrowDay();
              }
           return await chooseDay(this.page, day);
         });

         When('user choose film {string} and time {string}', async function (string, string2) {
           return await chooseTimeAndFilm(this.page, ['"', string, '"'].join(""), ['"', string2, '"'].join(""));
         });

         Then('user sees the film suggested {string}, the time suggested {string}, the hall suggested {string} on booking page', async function (string, string2, string3) {        
            await this.page.waitForSelector("h2");
            const chosenFilm = await "div.buying__info > div > h2";
            const chosenFilmText = await this.page.$eval(chosenFilm, el => el.textContent);
            expect(chosenFilmText).contains(string);
            // верное ли время?
            const chosenTime = await '.buying__info-start';
            const chosenTimeText = await this.page.$eval(chosenTime, el => el.innerText);
            expect(chosenTimeText).contains(`Начало сеанса: ${string2}`);
            // верный ли зал?
            const chosenHall = await '.buying__info-hall';
            const chosenHallText = await this.page.$eval(chosenHall, el => el.textContent);
            expect(chosenHallText).contains(string3); 
         });

         When('user choose raw {string} and chair {string} and click it', async function (string, string2) {
          await this.page.waitForSelector("h2");
          return await chooseAndClickChair(this.page, string, string2);
         });

         When('user press Book', async function () {
           return await book(this.page);
         });

         Then('user on {string} page', async function (string) {
            await this.page.waitForSelector('.ticket__check-title',{timeout: 60000});
            const url = await this.page.url(); 
            await console.log ("Page URL: "+ url);
            expect(url).contain(`${string}`);
         });

         Then('user sees the film suggested {string}, the hall suggested {string} on payment page', async function (string, string2) {
           const chosenFilmAfterBooking = ".ticket__info .ticket__title" ;
           const chosenFilmTextAfterBooking = await this.page.$eval(chosenFilmAfterBooking, el => el.textContent);
           expect(chosenFilmTextAfterBooking).contain(string);
           const chosenHallAfterBooking ='.ticket__details.ticket__hall';
           const chosenHallTextAfterBooking = await this.page.$eval(chosenHallAfterBooking, el => el.textContent);
           expect(chosenHallTextAfterBooking).contain(string2);
         });

         When('user press Show code', async function () {
           return await showCode(this.page);
         });

         Then('user should not see the page title {string}', async function (string) {
          string = await '.ticket__check-title';
          const finalSelector = await this.page.$(string);
          expect(finalSelector).to.be.null;
         });

         Then('user should remain on the {string} page', async function (string) {
            const url = await this.page.url(); 
            await console.log ("Page URL: "+ url);
            expect(url).contain(`${string}`);
        });

        Then('user can see QR code', async function () {
          await this.page.waitForSelector('.ticket__info-qr', {timeout: 60000});
        }) 
         