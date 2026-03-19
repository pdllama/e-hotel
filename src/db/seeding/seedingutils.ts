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