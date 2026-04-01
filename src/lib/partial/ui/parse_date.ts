import { differenceInCalendarDays, isAfter } from "date-fns"


const monthNums:any = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec'
}

export function parse_date(timestamp:string) {
    const date = new Date(timestamp)
    const month = date.getMonth()+1
    const day = date.getDate()

    return `${monthNums[month]} ${day}`
}

export function parse_time(timestamp:string) {
    const date = new Date(timestamp)
    const hour = date.getHours()
    const minute = date.getMinutes()

    return `${hour}:${minute}`
}

export function convertDateToDBFormat(date:{year:number|'', month:number|'', day: number|''}, afterToday:boolean=false) {
    if (!date.year || !date.month || !date.day) {return ''}

    const dateFormat = `${date.year}-${date.month < 10 ? `0${date.month}` : date.month}-${date.day < 10 ? `0${date.day}` : date.day}`
    if (afterToday) {
        const parsedD = new Date(`${date.month}-${date.day}-${date.year}`)
        const currDate = new Date()
        if (isAfter(parsedD, currDate)) {return dateFormat}
        else {return ''}
    }
    return dateFormat
}

export function getTodayDBFormat() {
    const today = new Date()
    const day = today.getDate()
    const month = today.getMonth()+1
    const year = today.getFullYear()
    return convertDateToDBFormat({year, month, day})
}

export function parseYear(timestamp:string) {
    const year = new Date(timestamp).getFullYear()
    return year
}

export function displayDate(dbDate:string, endDate:string|undefined, timeToo:boolean=false) {
    if (endDate) {
        const display = `${parse_date(dbDate)} ${parseYear(dbDate)}${timeToo ? ` ${parse_time(dbDate)}` : ''} - ${parse_date(endDate)} ${parseYear(endDate)}${timeToo ? ` ${parse_time(endDate)}` : ''}`
        return display
    } else {
        const display = `${parse_date(dbDate)} ${parseYear(dbDate)}${timeToo ? ` ${parse_time(dbDate)}` : ''}`
        return display
    }
    
}

export function getNumDays(startDate:string, endDate:string) {
    return differenceInCalendarDays(endDate, startDate)
}