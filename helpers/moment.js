const moment = require("moment")

function isValidDate(input) {
    const date = moment(input)
    if (!date.isValid())
        return true
    return false
}

function getMonthAndYear(input){
    const myMoment = moment(input)
    return {
        month: myMoment.format('MMMM').slice(0,3),
        year: myMoment.year()
    }
}

function getNowYear(){
    return moment().year()
}

function getNowMonth(){
    return moment().month() + 1
}

module.exports = {isValidDate, getMonthAndYear, getNowYear, getNowMonth}