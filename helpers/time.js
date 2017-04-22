"use strict";
const moment = require('moment');

let TimeFormatter = {};


TimeFormatter.secondsToDate = function(seconds) {
    let date = moment(seconds);
    return date.format("dddd, MMMM Do YYYY");
};


module.exports = TimeFormatter;
