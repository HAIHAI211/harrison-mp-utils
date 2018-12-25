import {addZero} from '../str'

export function getSimpleDate(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return {
        year,
        month,
        day,
        hour,
        minute,
        second
    }
}
export function getDate(date,options={
    dateFormat: '-',
    timeFormat: ':',
    showSecond: false,
    showDetail: true
}) {
    const simpleDate = getSimpleDate(date)
    const addZeroMonth = addZero(simpleDate.month)
    const addZeroDay =addZero(simpleDate.day)

    const addZeroHour = addZero(simpleDate.hour)
    const addZeroMinute = addZero(simpleDate.minute)
    const addZeroSecond = addZero(simpleDate.second)

    const formatDate = simpleDate.year + options.dateFormat + addZeroMonth + options.dateFormat + addZeroDay
    const formatTime = addZeroHour + options.timeFormat + addZeroMinute + (options.showSecond ? options.timeFormat + addZeroSecond : '')
    const fullFormatDate = formatDate + ' ' + formatTime

    let formatInfo = {
        addZeroMonth,
        addZeroDay,
        addZeroHour,
        addZeroMinute,
        addZeroSecond,
        formatDate,
        formatTime,
        fullFormatDate
    }

    let detail = {}
    if (options.showDetail) {
        let today = isToday(date)
        let yesterday = isYesterday(date)
        detail = {
            isToday: today,
            isYesterday: yesterday
        }
    }

    return Object.assign(simpleDate, formatInfo, detail)
}

export function getStepDate(step=0) { // step = -1:昨天;step = -2:前天;step= 0:今天
    let date = new Date()
    date.setDate(date.getDate() + step)
    return date
}

export function isDatesEqual(date1, date2) { // 两个日期是否是同一天
    let d1 = getSimpleDate(date1)
    let d2 = getSimpleDate(date2)
    return d1.year === d2.year && d1.month === d2.month && d1.day === d2.day
}

export function isStepDay(date, step) {// 判断date是否是step所在日期
    let date1 = getStepDate(step)
    return isDatesEqual(date1, date)
}

export function isYesterday(date) { // 判断date是否是此时此刻所在的昨天
    return isStepDay(date, -1)
}

export function isToday(date) { // 判断date是否是此时此刻所在的今天
    return isStepDay(date, 0)
}

