import {Country, State, City} from "country-state-city"

const listOfCountries = Country.getAllCountries().map(c => {return {name: c.name, value: c.name, code: c.isoCode}})

const countryNameToIsoCodeMap: {[key:string]: string} = {}
listOfCountries.forEach(c => {
    countryNameToIsoCodeMap[c.name] = c.code
}) 

const getListOfStatesByCountry = (isoCode:string) => {
    return State.getStatesOfCountry(isoCode).map(s => {return {name: s.name, value: s.name}})
}

const getListOfCitiesByCountry = (isoCode:string) => {
    const obj = City.getCitiesOfCountry(isoCode)
    return obj ? obj.map(c => {return {name: c.name, value: c.name}}) : []
}


export {listOfCountries, countryNameToIsoCodeMap, getListOfStatesByCountry, getListOfCitiesByCountry}