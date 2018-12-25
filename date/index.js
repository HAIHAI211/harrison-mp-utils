import {addZero} from '../str'
export function getDate(date) {
    const year = date.getFullYear()
    const month = addZero(date.getMonth() + 1)
    const day = addZero(date.getDate())

    const hour = addZero(date.getHours())
    const minute = addZero(date.getMinutes())
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
export function formatTime (date, showHour = true) {
    const mydate = getDate(date)

    const t1 = [mydate.year, mydate.month, mydate.day].map(addZero).join('-')
    const t2 = [mydate.hour, mydate.minute, mydate.second].map(addZero).join(':')

    return showHour ? `${t1} ${t2}` : t1
}

