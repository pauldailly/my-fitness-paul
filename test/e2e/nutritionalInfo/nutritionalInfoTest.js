"use strict";

const expect = require("chai").expect;
const nock = require('nock');
const productSearchResponse = require('./tescoProductSearchApiResponse.json');
const emptyProductSearchResponse = require('./tescoEmptyProductSearchResponse.json');
const productResponse = require('./tescoProductApiResponse.json');
const app = require('src/app');
const TESCO_API_KEY = process.env.TESCO_API_KEY;

describe("Nutritional Info", function () {

  describe("GetMacros Intent", function () {

    it("provides the macros for the specified food item", function (done) {

      const expectedDescription = 'I found macros for Propercorn Smooth Peanut And Almond 90G.';
      const expectedMacros = 'In 100 grams there are 23.5 grams of fat, 49.4 grams of carbs and 11.9 grams of protein.';
      const expectedCalories = 'The total calories are 481.';
      let expectedSpeechText = `${expectedDescription} ${expectedMacros} ${expectedCalories}`;

      let foodItem = 'peanut and almond propercorn';
      let getMacrosIntent = buildGetMacrosIntent(foodItem);

      let tescoServer = nock('https://dev.tescolabs.com', {
        reqheaders: {
          'Ocp-Apim-Subscription-Key': TESCO_API_KEY
        }
      }).get(`/grocery/products?query=${encodeURI(foodItem)}&offset=0&limit=100`)
        .reply(200, productSearchResponse)
        .get('/product?tpnb=80053777')
        .reply(200, productResponse);

      app.handler(getMacrosIntent, {}, (error, response) => {
        tescoServer.done();
        expect(response.response).to.exist;
        expect(response.response.outputSpeech).to.exist;
        expect(response.response.outputSpeech.text).to.equal(expectedSpeechText);
        done();
      });

    });

    it("provides apologetic response when macros cannot be found for food item", function (done) {

      let foodItem = 'bacon flavour chocolate';
      let expectedSpeechText = `Sorry, I cannot find the macros for ${foodItem}`;
      let getMacrosIntent = buildGetMacrosIntent(foodItem);
      let tescoServer = nock('https://dev.tescolabs.com', {
        reqheaders: {
          'Ocp-Apim-Subscription-Key': TESCO_API_KEY
        }
      }).get(`/grocery/products?query=${encodeURI(foodItem)}&offset=0&limit=100`)
        .reply(200, productSearchResponse)
        .get('/product?tpnb=80053777')
        .reply(200, emptyProductSearchResponse);

      app.handler(getMacrosIntent, {}, (error, response) => {
        tescoServer.done();
        expect(response.response).to.exist;
        expect(response.response.outputSpeech).to.exist;
        expect(response.response.outputSpeech.text).to.equal(expectedSpeechText);
        done();
      });

    });
  });

});

const buildGetMacrosIntent = function (foodItem) {
  return {
    "session": {
      "sessionId": "sessionId",
      "application": {
        "applicationId": "appId"
      },
      "attributes": {},
      "user": {
        "userId": "user1"
      },
      "new": true
    },
    "request": {
      "type": "IntentRequest",
      "requestId": "requestId",
      "locale": "en-US",
      "timestamp": "2017-01-09T21:19:59Z",
      "intent": {
        "name": "GetMacros",
        "slots": {
          "Food": {
            "name": "Food",
            "value": foodItem
          }
        }
      }
    },
    "version": "1.0"
  }
};