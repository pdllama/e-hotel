import { education } from '../../../static/db_enum_types';
import { get_rand_idx, roll_chance_binary, type City_Stats } from '../seedingutils';
import {default as names} from './../seeding data/name-data.json' with {type: 'json'}
import { generateNewAddress, type Address } from './address-seeding';

export interface PersonType {
    address: Address,
    first_name: string,
    middle_name: string,
    last_name: string,
    SSN: number
}

// We limit the amount of registration years to make logic for archives slightly easier.
const validRegistrationYears = ['2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022']
//mappings of month - # days in month
const monthDays:{[key:number]: number} = 
{1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31}


type NameType = typeof names
const centralSSNSet:Set<number> = new Set()

export function generateEmployee(homeCity:string, homeCityStats:City_Stats) {
    const person:PersonType = generatePerson(homeCity, homeCityStats);
    const education_level = education[get_rand_idx(education.length)] // Rand education level.
    return {person, education_level}
}

export function generateCustomer(homeCity:string, homeCityStats:City_Stats) {
    const person:PersonType = generatePerson(homeCity, homeCityStats);
    const registration_date = generateRegistrationYear();
    return {person, registration_date}
}

function generatePerson(homeCity:string, homeCityStats:City_Stats) {
    const addressData:Address = generateNewAddress(homeCity, homeCityStats.state, homeCityStats.country, homeCityStats.lang, true);
    const nameData = generateNames(homeCityStats.lang);
    let SSN = generateSSN();

    SSN = ensureUniqueSSN(SSN);

    return {address: addressData, ...nameData, SSN} as PersonType
}

function generateSSN() {
    // 9 digit number
    let strId:string = ""
    for (let i=0;i<9;i++) {
        strId+= Math.floor(Math.random()*10);
    }
    return parseInt(strId)
}

function ensureUniqueSSN(id:number) {
    // Very very low chance we run into collisions (~0.00005%), but this just ensures it is unique.
    // See reason why we do it here in address-seeding.ts for ensure-unique

    if (centralSSNSet.has(id)) {
        let count = 0;
        let newid = id
        while (centralSSNSet.has(newid) || count < 5) {
            newid = generateSSN()
            count++
        }
        centralSSNSet.add(newid)
        return newid
    } else {
        centralSSNSet.add(id)
        return id
    }
}

function generateNames(lang:string) {
    // there is a flat 70% chance for a name to be within the language of the address city and 30% to be an international name.
    // I could account for diverse ethnicities within every specific country but i'm already beyond scope.

    const nonLangName = roll_chance_binary(30);
    let actualLang = lang
    let first_name:string;
    let middle_name:string;
    let last_name:string;
    if (nonLangName) {
        const otherLangs = Object.keys(names).filter(l => l != lang)
        const randL = otherLangs[get_rand_idx(otherLangs.length)];
        actualLang = randL
    }
    const langNamesData = names[actualLang as keyof NameType]
    const firstNamesList = langNamesData.first_name
    const lastNamesList = langNamesData.last_name
    // I didn't want to seed unique middle names, so its 50/50 whether it gets seeded from the firstnames list or lastnames list
    const useFirstAsMiddle = roll_chance_binary(50); 

    first_name = pullRandName(firstNamesList);
    middle_name = pullRandName(useFirstAsMiddle ? firstNamesList : lastNamesList);
    last_name = pullRandName(lastNamesList);

    return {first_name, middle_name, last_name}
}

function pullRandName(names:string[]) {
    return names[get_rand_idx(names.length)];
}

function generateRegistrationYear() {
    const year = validRegistrationYears[get_rand_idx(validRegistrationYears.length)];
    const monthNum = Math.floor((Math.random()*12)+1);
    const day = Math.floor(Math.random()*(monthDays[monthNum])+1)
    return `${year}-${monthNum}-${day}`
}
