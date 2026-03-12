import { listOfCountries, getListOfStatesByCountry, getListOfCitiesByCountry } from "$lib/partial/signup-form/address-input-constants";
import { allowedCountryCodes } from "./allowed-countries";
const filteredCountryNamesList = listOfCountries.filter((c) => {
    return allowedCountryCodes.includes(c.value)
}).map((c) => c.name)

// let t = 0;

// for (let c of allowedCountryCodes) {
//     const listOfStates = getListOfStatesByCountry(c)
//     console.log(c + ' - States:')
//     let i = 1;
//     for (let s of listOfStates) {
//         console.log(`${i}. ${s.name}`)
//         i++
//         t++
//     }
// }

// console.log("TOTAL STATE-COUNTRY COMBOS: "+t)
const countryCode = ""
const cities = getListOfCitiesByCountry(countryCode)
for (let c of cities) {
    console.log(c)
}

export const thing = {hi: "hi"}