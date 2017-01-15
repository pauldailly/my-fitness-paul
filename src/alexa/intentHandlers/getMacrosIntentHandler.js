"use strict";
const nutritionalInfo = require('src/nutritionalInfo');
const responseBuilder = require('src/alexa/api/alexaResponseBuilder');
const metrics = require('src/metrics');

const extractFoodItemFromIntent = (intent) => {
  return intent.slots.Food.value;
};

const buildSpokenTextFromMacroInfo = (foodItem, macroInfo) => {
  const description = `I found macros for ${macroInfo.product.description}`;
  const servingSize = `In ${macroInfo.serving.value} ${macroInfo.serving.unit} there are`;
  const protein = `${macroInfo.macros.protein.value} ${macroInfo.macros.protein.unit} of protein`;
  const carbs = `${macroInfo.macros.carbs.value} ${macroInfo.macros.carbs.unit} of carbs`;
  const fat = `${macroInfo.macros.fat.value} ${macroInfo.macros.fat.unit} of fat`;
  const calories = `The total calories are ${macroInfo.calories.value}`;

  return `${description}. ${servingSize} ${fat}, ${carbs} and ${protein}. ${calories}.`;
};

const handleError = (foodItem, callback) => {
  const errorText = `Sorry, I cannot find the macros for ${foodItem}`;
  let errorResponse = responseBuilder.buildResponse(errorText);
  metrics.publishMetric('GetMacrosMissingFoodItem', foodItem)
    .then(() => {
      return callback(null, errorResponse);
    });
};

const handleIntent = (intent, context, callback) => {
  const foodItem = extractFoodItemFromIntent(intent);

  return nutritionalInfo.getMacros(foodItem)
    .then((macroInfo) => {
      const spokenText = buildSpokenTextFromMacroInfo(foodItem, macroInfo);
      return callback(null, responseBuilder.buildResponse(spokenText));
    })
    .catch(() => {
        return handleError(foodItem, callback);
    });
};

module.exports = (intent, context, callback) => {
  return handleIntent(intent, context, callback)
};