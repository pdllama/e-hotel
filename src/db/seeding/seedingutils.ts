// TO-DO:
// 1. make function to generate a random postal code for each allowed country
// 2. function to generate 


export interface Hotel_Assignment {
    chain_name: string,
    size: string    //sm, md, lg
}

export interface Chain_Assignment {
    chain_name: string,
    size: string,    // local, intl
    city: string   // tells you where to put the co-address
}

export interface City_Stats {
    state: string,
    country: string,
    lang: string,
    num_hotels: number,
    hotel_chains: string[]
    hotel_sizes: string[],
    hotel_address_uuid: string[]
}

export interface Hotel_Stats {
    [key:string]: {
        [key:number]: {
            room: {}
            problems: []
        }
    }
}

export function roll_chance_binary(percent:number) {
    // Rolls and posts the boolean result of two possible outcomes (like a toin coss)
    // percent refers to the chance of success. 

    const randNum = Math.random()*100 // Rand number between 0-100
    return randNum < percent
}

export function roll_chance_multi(percents:number[], results: any[]) {
    // Rolls and posts the result based on a single roll. percents length and results length must be equal.
    // the chance of result[1] corresponds to the percent chance of percents[1], and so on

    if (percents.length != results.length || percents.reduce((acc, curr) => acc+curr) != 100) {return undefined}

    const randNum = Math.random()*100 //rand number between 0-100
    let lower = 0;
    let upper = 0;
    for (let i=0; i<percents.length;i++) {
        upper += percents[i]
        if (lower < randNum && randNum < upper) {return results[i]}
        lower += percents[i]
    }
}

// get a random idx given a length
export function get_rand_idx(length:number) {
    return Math.floor(Math.random() * length)
}

// get a random integer between min and max
export function get_rand_between(min:number, max:number) {
    return (Math.floor(Math.random() * (max - min + 1)) + min)
}

const year_min = 2000
const year_max = 2026
const monthDays:{[key:number]: number} = 
{1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31}

export function get_rand_date() {
    const year = get_rand_between(year_min, year_max).toString();
    const monthNum = Math.floor((Math.random()*12)+1);
    const day = Math.floor(Math.random()*(monthDays[monthNum])+1);
    return `${year}-${monthNum < 10 ? `0${monthNum}` : monthNum}-${day < 10 ? `0${day}` : day}`
}

export function get_rand_date_after(date:string, frame:number, min:number=1) {
    // Returns a rand_date after a given date and (optionally) within a specific time frame (in days)
    // min refers to the minimum number of days that must pass after the date. usually 1
    // note date will always be in the format "YYYY-MM-DD"

    let date_year = parseInt(date.slice(0, date.indexOf("-")))
    let date_month = parseInt(date.slice(date.indexOf("-")+1, date.indexOf("-")+3));
    let date_day = parseInt(date.slice(date.length-2, date.length));

    const addDays = get_rand_between(min, frame);
    date_day += addDays 
    while (date_day > monthDays[date_month%12]) {
        date_day -= monthDays[date_month%12];
        date_month += 1
    } 
    while (date_month > 12) {
        date_month -= 12
        date_year++
    }

    return `${date_year}-${date_month < 10 ? `0${date_month}` : date_month}-${date_day < 10 ? `0${date_day}` : date_day}`
}

export function get_rand_date_before(date:string, frame:number, min:number=1) {
    //same as above but before a date before
    // Algorithm is a little different, though.

    let date_year = parseInt(date.slice(0, date.indexOf("-")))
    let date_month = parseInt(date.slice(date.indexOf("-")+1, date.indexOf("-")+3));
    let date_day = parseInt(date.slice(date.length-2, date.length));

    const removeDays = get_rand_between(min, frame);
    date_day -= removeDays 
    while (date_day < 0) {
        date_month -= 1
        if (date_month < 1) {
            date_month = 12;
            date_year--;
        }
        date_day += monthDays[date_month];
    }

    return `${date_year}-${date_month < 10 ? `0${date_month}` : date_month}-${date_day < 10 ? `0${date_day}` : date_day}`
}

export function get_rand_time() {
    const hourNum = get_rand_between(0, 23);
    const hour = hourNum < 10 ? "0"+hourNum : hourNum.toString()
    const minNum = get_rand_between(0, 59);
    const min = minNum < 10 ? "0"+minNum : minNum.toString()
    const secNum = get_rand_between(0, 59);
    const sec = secNum < 10 ? "0"+secNum : secNum.toString();

    return `${hour}:${min}:${sec}`
}