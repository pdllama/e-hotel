import { hotel_debounced_query } from "../../db/queries/hotel_selects"
import { goto } from "$app/navigation"

function editSearchQuery(field:string, newQuery:string, otherQueries:string) {
    
}

function enter_search(query:string, otherQueries:string) {
    const urlstring = `/search${query == "" ? "" : `?q=${query}`}`;
    goto(urlstring);
}

function pagination(query:string, pageNum:number) {

}

function parseAmenitiesQuery(queryString:string) {
    // Since amenities is multivalued (and you can search by multiple amenities), we delimit the querystring with ;
    if (!queryString) {return undefined}
    const amenities:string[] = queryString.split(';')
    return amenities
}

function parsePriceRange(queryString:string) {
    if (!queryString) {return undefined}
    const priceRange = queryString.split("-")
    if (priceRange.length > 2 || priceRange.length <= 1) {return undefined}
    const formatted = priceRange.map(s => parseInt(s));
    if (isNaN(formatted[0]) || isNaN(formatted[1])) {return undefined}
    if (formatted[0] > formatted[1]) {return undefined}
    return {min: formatted[0], max: formatted[1]}
}

export {enter_search, parseAmenitiesQuery, parsePriceRange}