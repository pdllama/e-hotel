import {Country, State, City} from "country-state-city"

const listOfCountries = Country.getAllCountries().map(c => {return {name: c.name, isoCode: c.isoCode}})

const getListOfStatesByCountry = (isoCode:string) => {
    return State.getStatesOfCountry(isoCode).map(s => {return {name: s.name}})
}

const getListOfCitiesByCountry = (isoCode:string) => {
    return City.getCitiesOfCountry(isoCode)?.map(c => {return {name: c.name}})
}

export {listOfCountries, getListOfStatesByCountry, getListOfCitiesByCountry}