'use strict'
const dictionary = require('./dictionary');
const moment = require('moment')

let getFeel = temp => {
    if (temp < 5) {
        return "shivering cold"
    } else if (temp >= 5 && temp < 15) {
        return "preety cold"
    } else if (temp >= 15 && temp <= 25) {
        return "moderately cold"
    } else if (temp >= 25 && temp < 32) {
        return "quite warm"
    } else if (temp >= 32 && temp < 40) {
        return "very hot"
    } else {
        return "super hot"
    }
}

let getPrefix = (conditionCode, tense = 'present') => {
    let findPrefix = dictionary[tense].find(item => {
        if (item.codes.indexOf(Number(conditionCode)) > -1) {
            return true
        }
    });
    return findPrefix.prefix || ""
}

let getDate = day => {
    let dayStr = day.toLowerCase().trim()
    switch (dayStr) {
        case 'tomorrow':
            return moment().add(1, 'd').format('DD MMM YYYY')
            break;
        case 'day after tomorrow':
            return moment().add(2, 'd').format('DD MMM YYYY')
            break;
        default:
            return moment().format('DD MMM YYYY')
    }
}

let currentWeather = response => {
    if (response.query.results) {
        let resp = response.query.results.channel;
        let location = `${resp.location.city},${resp.location.country}`
        //Access conditions 
        let { text, temp, code } = resp.item.condition;

        return `Right now, ${getPrefix(Number(code))} ${text.toLowerCase()} in ${location}. It is ${getFeel(Number(temp))} at ${temp} degrees Celsuis`

    }
}

let WeatherForecast = (response, data) => {
    if (response.query.results) {
        let parseDate = getDate(data.time)
        let resp = response.query.results.channel;
        let location = `${resp.location.city},${resp.location.country}`
        let getForecast = resp.item.forecast.filter((item) => {
            return item.date === parseDate
        })[0]
        let regex = new RegExp(data.weather, 'i')
        let testCondition = regex.test(getForecast.text)
        
        return `${testCondition ? 'Yes' : 'No'}, ${getPrefix(Number(getForecast.code), 'future')} ${getForecast.text.toLowerCase()} ${data.time} in ${location}`
    } else {
        return `I don't seems to know anything about this place....Sorry :(`
    }
}

module.exports = {
    currentWeather,
    WeatherForecast
}