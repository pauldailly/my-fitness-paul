"use strict";
const apiClient = require('./tescoApiClient');
const responseParser = require('./tescoApiResponseParser');

const extractTpnb = (productList) => {
  console.log('Extracting tpnb');
  const products = responseParser.extractProductsFromSearchResults(productList);
  if (products.length == 0) {
    throw new Error("No products found")
  }

  const tpnb = products[0]['tpnb'];
  return Promise.resolve(tpnb)
};

exports.getMacros = (query) => {
  // construct the request url for product search api
  // then call the product api
  return apiClient.searchForProduct(query)
    .then(extractTpnb)
    .then(apiClient.getProduct)
    .then(responseParser.extractNutritionalInfo);
  //.catch();
  // then parse and return the macros
};