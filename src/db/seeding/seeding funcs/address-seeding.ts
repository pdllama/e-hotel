import { get_rand_idx, roll_chance_binary } from '../seedingutils'
import {default as streets} from './../seeding data/street-languages.json' with {type: "json"}
import {default as address} from './../seeding data/address-seeding-data.json' with {type: "json"}

const alphabet = "abcdefghijklmnopqrstuvwxyz"

interface Address {
    street_number: number,
    street_name: string,
    apt_number: number,
    postal_code: string,
    city: string,
    state: string,
    country: string
}

interface AddressBook {
    [key:string]: { // Key representing the city
        [key:string]: Address[] // Key representing the postal_code
    }
}

// We use this central address book to enforce uniqueness of attribute combinations.
// Normally this is handled by the UNIQUE constraint, allowing us to use the address id of that row instead of inserting an identical one.
// But because the seeding is being done to insert multiple rows, it would be a massive interruption to have to check if each address insertion doesnt result in an error.
// So we error check on address generation, keeping track of all the addresses we've generated already.
const centralAddressBook: AddressBook = {}

type StreetType = typeof streets
type AddressType = typeof address
export function generateNewAddress(city:string, state:string, country:string, lang:string, canAptNum:boolean) {
    const addressInfo = address[lang as keyof AddressType]
    const streetData = streets[lang as keyof StreetType];
    let street_name = generateStreetName(streetData, addressInfo.street_format)
    let street_number = generateStreetNum()
    let postal_code = generatePostalCode(addressInfo.postal_format)
    let apt_number = canAptNum ?  // if canAptNum (person address), then 40% chance to have one
        roll_chance_binary(40) ? generateAptNum() : 0 : 0
    
    const addressInst : Address = {street_number, street_name, apt_number, postal_code, city, state, country}

    const unique = {streetNum: true, streetName: true, aptNum: true }

    ensureUnique(addressInst, unique, streetData, addressInfo.street_format);

    return addressInst

}

function generateStreetName(streetData:any, format:string) {
    const randStreetPrefix = streetData.prefixes[get_rand_idx(streetData.prefixes.length)]
    const randStreetName = streetData.names[get_rand_idx(streetData.names.length)]
    let streetName = ""
    for (let c of format) {
        if (c == "p") {streetName+=randStreetPrefix}
        else if (c == "n") {streetName+=randStreetName}
        else {streetName+=c}
    }
    return streetName
}

function generateStreetNum() {
    return Math.ceil(Math.random()*998) // street numbers go up to 999
}

function generateAptNum() {
    return Math.ceil(Math.random()*499) // street numbers go up to 500
}

function generatePostalCode(format:string) {
    let postalcode = ""
    for (let c of format) {
        if (c == "d") {postalcode += Math.floor(Math.random()*10)}
        else if (c == "l") {postalcode+= alphabet[get_rand_idx(alphabet.length)]}
        else {postalcode += c}
    }
    return postalcode
}

function ensureUnique(address:Address, uniqueObj:any, streetData:any, street_format:string) {
    let isUnique = checkUnique(address, uniqueObj) 
    let i = 0;
    while (!isUnique && i < 5) {
        // I can't imagine that it'll take more than 5 re-rolls to get a truly unique combination, given the amount of seeding data/possible combinations.
        // However, in the freak off-chance that it does, I put a counter to guard against perma loops.
        // Realistically, we should get a unique combination in the first roll pretty much every time.
        if (uniqueObj.aptNum == false) {address.apt_number = generateAptNum()}
        else if (uniqueObj.streetNum == false) {address.street_number = generateStreetNum()}
        else {address.street_name = generateStreetName(streetData, street_format)}
        i++
        isUnique = checkUnique(address, uniqueObj)
    }
}

function checkUnique(address:Address, uniqueObj:any) {
    //checks if an address combination is unique.

    if (centralAddressBook[address.city] == undefined) {
        centralAddressBook[address.city] = {}
        centralAddressBook[address.city][address.postal_code] = [address]
        return true
    } else if (centralAddressBook[address.city][address.postal_code] == undefined) {
        centralAddressBook[address.city][address.postal_code] = [address]
        return true
    } else {
        let unique = true
        for (let add of centralAddressBook[address.city][address.postal_code]) {
            const streetNameMatches = add.street_name == address.street_name;
            const streetNumMatches = add.street_number == address.street_number;
            const aptNumMatches = add.apt_number == address.apt_number;
            if (streetNameMatches && streetNumMatches && aptNumMatches) {
                unique = false
                //  Below lets us know which fields we should change. We only need to change one if multiple match.
                //  From easiest to hardest to change : AptNum, StreetNum, StreetName
                uniqueObj['streetName'] = streetNameMatches ? false : true,
                uniqueObj['streetNum'] = streetNumMatches ? false : true,
                uniqueObj['aptNum'] = aptNumMatches ? false : true
            }
        }
        if (unique) {
            centralAddressBook[address.city][address.street_name].push(address)
        }
        return unique
    }
}
