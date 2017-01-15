"use strict";
const request = require('request-promise');

const TESCO_API_KEY = process.env.TESCO_API_KEY;
const TESCO_BASE_URI = process.env.TESCO_BASE_URI;
const MAX_SEARCH_RESULTS = 100;
const HEADERS = {
  'Ocp-Apim-Subscription-Key': TESCO_API_KEY
};

exports.searchForProduct = (productQuery) => {
  const options = {
    uri: `${TESCO_BASE_URI}/grocery/products`,
    qs: {
      query: productQuery,
      offset: 0,
      limit: MAX_SEARCH_RESULTS
    },
    headers: HEADERS,
    json: true
  };
  console.log(`Searching for Tesco product ${productQuery}`);

  return request(options)
    .then((response) => {
      return Promise.resolve(response);
    });
};

exports.getProduct = (tpnb) => {
  const options = {
    uri: `${TESCO_BASE_URI}/product`,
    qs: {
      tpnb: tpnb
    },
    headers: HEADERS,
    json: true
  };

  return request(options);
};