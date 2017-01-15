"use strict";

const extractMacronutrient = (macroNutrient, nutrients) => {
  const macronutrientInfo = nutrients.find((nutrient) => {
    return nutrient['name'] == macroNutrient;
  });

  if (!macronutrientInfo) {
    return null;
  }

  return macronutrientInfo['valuePer100'];
};

exports.extractNutritionalInfo = (response) => {
  const productWithNutrition = response['products'].find((product) => {
    return product['calcNutrition'];
  });

  if (!productWithNutrition) {
    throw new Error(`No nutrition info found in response ${JSON.stringify(response)}`);
  }

  const calculatedNutrition = productWithNutrition['calcNutrition'];
  const nutrients = calculatedNutrition['calcNutrients'];

  return {
    product: {
      description: productWithNutrition['description']
    },
    serving: {
      value: "100",
      unit: "grams"
    },
    macros: {
      protein: {
        value: extractMacronutrient('Protein (g)', nutrients),
        unit: 'grams'
      },
      carbs: {
        value: extractMacronutrient('Carbohydrate (g)', nutrients),
        unit: 'grams'
      },
      fat: {
        value: extractMacronutrient('Fat (g)', nutrients),
        unit: 'grams'
      },
    },
    calories: {
      value: extractMacronutrient('Energy (kcal)', nutrients),
      unit: 'calories'
    }
  };

};

exports.extractProductsFromSearchResults = (searchResults) => {
  const countryCode = 'uk';
  const ghs = 'ghs';
  const products = 'products';
  const results = 'results';

  if (!(searchResults[countryCode] || searchResults[countryCode][ghs] || searchResults[countryCode][ghs][products] || searchResults[countryCode][ghs][products][results])) {
    return [];
  }

  return searchResults[countryCode][ghs][products][results];
};