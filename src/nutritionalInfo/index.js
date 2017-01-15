const tescoNutritionalInfo = require('./tesco');

exports.getMacros = function (foodItem) {
  return tescoNutritionalInfo.getMacros(foodItem);
};