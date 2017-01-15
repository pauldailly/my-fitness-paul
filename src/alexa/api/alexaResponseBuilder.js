"use strict";

exports.buildResponse = (spokenText) => {
  return {
    "version": "1.0",
    "response": {
      "outputSpeech": {
        "type": "PlainText",
        "text": spokenText
      },
      "shouldEndSession": true
    },
    "sessionAttributes": {}
  }
};