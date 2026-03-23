// TO-DO:
// 1. make function to generate a random postal code for each allowed country
// 2. function to generate 

import { roll_num_of_rooms } from "./seeding funcs/room-seeding.ts"


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
    country_code: string,
    lang: string,
    num_hotels: number,
    hotel_chains: string[]
    hotel_sizes: string[],
    hotel_address_uuid: string[]
}

export interface Hotel_Stats {
    [key:string]: { // address_id
        [key:number]: { // room_number
            room: {}
            problems: []
        }
    }
}

export interface ProblemMapping {
    // maps out timing of room problems
    [key:string]: { // hotel address_id
        [key:number]: { // room_number
            [key:number]: { // year
                [key: number]: // month
                    Set<Number> // set of days where there is a problem so no one can make a stay.
            }
        }
    }
}

export interface Hotel_RoomNum_Map {
    [key:string]: {size: string, numRooms: number, city: string}
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

export function get_rand_arr_item(arr:any[]) {
    return arr[get_rand_idx(arr.length)];
}

const year_min = 2000
const year_max = 2026
export const monthDays:{[key:number]: number} = 
{0: 31, 1: 28, 2: 31, 3: 30, 4: 31, 5: 30, 6: 31, 7: 31, 8: 30, 9: 31, 10: 30, 11: 31} // 0-based so mod works.

export function get_rand_date() {
    const year = get_rand_between(year_min, year_max).toString();
    const monthNum = Math.floor((Math.random()*12)+1);
    const day = Math.floor(Math.random()*(monthDays[monthNum-1])+1);
    return `${year}-${monthNum < 10 ? `0${monthNum}` : monthNum}-${day < 10 ? `0${day}` : day}`
}

export function get_rand_date_after(date:string, frame:number, min:number=1) {
    // Returns a rand_date after a given date and (optionally) within a specific time frame (in days)
    // min refers to the minimum number of days that must pass after the date. usually 1
    // note date will always be in the format "YYYY-MM-DD"

    let {year, month, day} = parse_date(date)

    const addDays = get_rand_between(min, frame);
    day += addDays 
    while (day > monthDays[((month-1)%12)]) {
        day -= monthDays[(month-1)%12];
        month += 1
    } 
    while (month > 12) {
        month -= 12
        year++
    }

    return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`
}

export function parse_date(date:string) {
    //parses a YYYY-MM-DD formatted date-string into its respective number components.
    let year = parseInt(date.slice(0, date.indexOf("-")))
    let month = parseInt(date.slice(date.indexOf("-")+1, date.indexOf("-")+3));
    let day = parseInt(date.slice(date.length-2, date.length));
    return {year, month, day}
}



export function get_rand_date_before(date:string, frame:number, min:number=1) {
    //same as above but before a date before
    // Algorithm is a little different, though.

    let {year, month, day} = parse_date(date)

    const removeDays = get_rand_between(min, frame);
    day -= removeDays 
    while (day < 1) {
        month -= 1
        if (month < 1) {
            month = 12;
            year--;
        }
        day += monthDays[month-1];
    }

    return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`
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

export function convertToHotelSizeMapping(cityStatMapping:{[key:string]: City_Stats}) {
    const cities = Object.keys(cityStatMapping)
    const result:Hotel_RoomNum_Map = {}
    for (let city of cities) {
        const cityStat = cityStatMapping[city]
        for (let i = 0; i < cityStat.hotel_chains.length; i++) {
            const hotelSize = cityStat.hotel_sizes[i]
            result[cityStat.hotel_address_uuid[i]] = {size: hotelSize, numRooms: roll_num_of_rooms(hotelSize), city}
        }
    }
    return result
}

export function addProblemMap(
    address_id: string,
    room_number: number,
    year: number,
    month:number,
    day:number,
    problemMap:ProblemMapping
) {
    const roomProblems = problemMap[address_id][room_number];
    if (roomProblems[year] == undefined) {
        roomProblems[year] = {}
    }
    if (roomProblems[year][month] == undefined) {
        roomProblems[year][month] = new Set<number>();
    }
    roomProblems[year][month].add(day)
}

export function getCurrDateComponents() {
    const date = new Date();
    return {year: date.getFullYear(), month: date.getMonth()+1, day: date.getDate()}
}

export function getYearDiff(date1:string, date2:string) {
    let year1 = parseInt(date1.slice(0, date1.indexOf("-")))
    let year2 = parseInt(date2.slice(0, date2.indexOf("-")))
    return year2-year1
}