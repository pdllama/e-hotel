import {default as countries} from "./seeding data/address-seeding-data.json" with {type:'json'} 
import {default as chain_names} from "./seeding data/hotel/chain-data.json" with {type:'json'} 

const lang_num:any = {}
const chain_name_num:any = {}
const duplicates:Set<string> = new Set()
let totalCities = 0

type CountriesType = typeof countries
const country_codes : string[] = Object.keys(countries);

// Get num of cities per lang

// for (let country of country_codes as (keyof CountriesType)[]) {
//     const data = countries[country]
//     if (lang_num[data.language] == undefined) {
//         lang_num[data.language] = 0
//     }
//     lang_num[data.language] += data.cities.length
//     totalCities += data.cities.length
// }

// const langCode = Object.keys(lang_num);
// console.log(totalCities)

// for (let lang of langCode) {
//     console.log(lang+": "+lang_num[lang]+", so you require "+lang_num[lang]*5+" chain names\n")
// }


// Get num of chain names per lang

// type ChainType = typeof chain_names
// const lang_codes : string[] = Object.keys(chain_names)

// for (let lang of lang_codes as (keyof ChainType)[]) {
//     const chains = chain_names[lang]
//     chain_name_num[lang] = chains.length;
// }

// for (let lang of langCode) {
//     console.log(lang+": "+chain_name_num[lang]+" chain names\n")
// }


// Below checks missing num of chains per language
// for (let lang of langCode) {
//     const missing = lang_num[lang]*5 - chain_name_num[lang] < 0 ? 0 : lang_num[lang]*5 - chain_name_num[lang]
//     console.log(lang+": "+lang_num[lang]+", so you require "+lang_num[lang]*5+" chain names. You have "+chain_name_num[lang]+"chains, you are missing "+missing+" chains\n")
// }


// find duplicate chain names if any

// type ChainType = typeof chain_names
// const lang_codes : string[] = Object.keys(chain_names)
// const chNames:any = new Set()

// for (let lang of lang_codes as (keyof ChainType)[]) {
//     const chains = chain_names[lang]
//     for (let ch of chains) {
//         if (chNames.has(ch)) {duplicates.add(ch)}
//         chNames.add(ch)
//     }
// }

// for (let ch of duplicates) {
//     console.log(ch)
// }