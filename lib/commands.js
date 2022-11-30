module.exports = {
  chooseDay: async function(page, day) {
       try {
          const [weekDay] = await page.$x(`//span[contains(text(), ${day})]`);
          await weekDay.click();
       } catch (error) {
          throw new Error('Choice of day is failed');
       }
  },

  chooseTimeAndFilm: async function(page, film, time) {
      try {
           // для того, чтобы кликнуть на 12:00 Фильма 3, а не какого-то другого фильма:
           // 1. мы находим прародителя, у которого есть "внук" Фильм 3
           // 2. затем у этого прародителя ищем элемент 12:00
           // Таким образом, находим 12:00 именно Фильма 3
          const [parentElementThatHaveChildElementWithSpesialName] = await page.$x(`//section[./div[./div[./h2[contains(text(), ${film})]]]]`);
          const [timeElement] = await parentElementThatHaveChildElementWithSpesialName.$x(`//a[contains(text(), ${time})]`);
          await timeElement.click();
      } catch (error) {
          throw new Error('Choice of time and film is failed');
      }
  },
  
  checkTicketDataBeforeBooking: async function(page, filmForEqual, timeForEqual, hallForEqual) {
      try {
          // тот ли фильм?
          await page.waitForSelector('h2', {timeout: 60000});
          const chosenFilm = 'div.buying__info > div > h2';
          const chosenFilmText = await page.$eval(chosenFilm, el => el.textContent);
          expect(chosenFilmText).toEqual(filmForEqual);
          // верное ли время?
          const chosenTime = '.buying__info-start';
          const chosenTimeText = await page.$eval(chosenTime, el => el.innerText);
          expect(chosenTimeText).toEqual(`Начало сеанса: ${timeForEqual}`);
          // верный ли зал?
          const chosenHall = '.buying__info-hall';
          const chosenHallText = await page.$eval(chosenHall, el => el.textContent);
          expect(chosenHallText).toEqual(hallForEqual);  
      } catch (error) {
          throw new Error('Check ticket before booking is failed');
      }
  },
  
  chooseAndClickChair: async function(page, row, chair) {
      try {
        // выбираем ряд
        const rowElement = await page.$(`.buying-scheme__row:nth-child(${row})`);
        // выбираем кресло, выбранного ранее ряда
        const chairElement = await rowElement.$(`.buying-scheme__chair:nth-child(${chair})`);
        // кликаем на кресло
        await chairElement.click();
      } catch (error) {
        throw new Error('Chair was not chosen');
      }
 },

  book: async function(page) {
      try {
          const [bookingButton] = await page.$x('//button[contains(text(),"Забронировать")]');
          await bookingButton.click();
      } catch (error) {
          throw new Error('Booking is failed');
      }
  },

  checkUrl: async function(page, expectedUrlAfterAttemptOfBooking) {
      try {
          /* await page.waitForTimeout(4000); */
          const url = await page.url(); 
          expect(url).toEqual(`${expectedUrlAfterAttemptOfBooking}`);
      } catch (error) {
          throw new Error('URL of page is not equal to expected');
      }
  },

  checkTicketDataAfterBooking: async function(page, filmForEqual, hallForEqual) {
      try {
         const chosenFilmAfterBooking = '.ticket__info .ticket__title';
         const chosenFilmTextAfterBooking = await page.$eval(chosenFilmAfterBooking, el => el.textContent);
         expect(chosenFilmTextAfterBooking).toEqual(filmForEqual);
         const chosenHallAfterBooking ='.ticket__details.ticket__hall';
         const chosenHallTextAfterBooking = await page.$eval(chosenHallAfterBooking, el => el.textContent);
         expect(chosenHallTextAfterBooking).toEqual(hallForEqual); 
      } catch (error) {
         throw new Error('Check ticket after booking is failed');
      }  
  },

  showCode: async function (page) {
      try {
          await page.waitForSelector('.acceptin-button', {timeout: 60000});
          const [codeButton] = await page.$x('//button[contains(text(),"Получить код бронирования")]');
          await codeButton.click();
          await page.waitForNavigation();
      } catch (error) {
          throw new Error('Press on button Show code is failed');
      }
  },

  codeIsVisible: async function (page) {
      try {
          await page.waitForSelector('.ticket__info-qr', {timeout: 60000});
      } catch (error) {
          throw new Error('Code can not be shown');
      }
  }
}