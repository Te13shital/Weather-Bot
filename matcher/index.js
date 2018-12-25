'use strict';
const patterns = require('../patterns');
const XRegExp = require('xregexp');

let createEntities = (str, pattern) => {
    return XRegExp.exec(str, XRegExp(pattern, "i"));
}

//str-> user input 
//cb-> callback function which willl fired once we done with expression matched
// we will also passed an object with callback function which will contains possible intents and enitites
let matchPattern = (str, cb) => {
    //find method iterate every array object
    let getResult = patterns.find(item => {
        if (XRegExp.test(str, XRegExp(item.pattern, "i"))) {
            return true;
        }
    })
    if (getResult) {
        return cb({
            intent: getResult.intent,
            entities: createEntities(str, getResult.pattern)
        })
    } else {
        return cb({})
    }
}


module.exports = matchPattern;