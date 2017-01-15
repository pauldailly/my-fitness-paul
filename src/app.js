'use strict';
const alexa = require('./alexa');

exports.handler = function (event, context, callback) {
  const skill = alexa.createSkill();
  return skill.execute(event, context, callback);
};