"use strict";
const getMacrosIntentHandler = require('./intentHandlers/getMacrosIntentHandler');

const INTENT_REQUEST_TYPE = "IntentRequest";

const proto = {
  init(){
    this.intentHandlers['GetMacros'] = getMacrosIntentHandler;
  },

  execute(event, context, callback){
    let request = event.request;

    if (request && request.type == INTENT_REQUEST_TYPE) {
      const intent = request.intent.name;
      console.log(`Executing intent ${intent}`);
      return this.intentHandlers[intent].call(this, event.request.intent, context, callback)
    }
    console.log('Ending function call');
    return callback(new Error(`No handler found for request ${event}`));
  }
};

exports.createSkill = function () {
  let skill = Object.assign({}, proto, {intentHandlers: {}});
  skill.init();
  return skill;
};