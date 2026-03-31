import { differenceInCalendarDays } from "date-fns"


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

export function parseYear(timestamp:string) {
    const year = new Date(timestamp).getFullYear()
    return year
}

export function getNumDays(startDate:string, endDate:string) {
    return differenceInCalendarDays(endDate, startDate)
}