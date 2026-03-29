import { hotel_debounced_query } from "../../db/queries/hotel_selects"
import { goto } from "$app/navigation"

function getNewPriceRangeQuery(filters:{min:number, max:number|string}) {
    const {min, max} = filters
    if (min == 0 && max == 0) {return ''}
    return `${min}-${max}`
}

function getNewRatingQuery(rating:number) {
    if (rating <= 1) {return ''}
    return `rating=${rating}`
}

function getNewAmenitiesQuery(amenities:string[]) {
    if (amenities.length == 0) {return ''}
    let query = ''
    for (let i = 0; i < amenities.length ; i++) {
        query += amenities[i]
        if (i != amenities.length) {query+=";"}
    }
    return query
}

// This function doesn't handle q='' search query. just price, rating, amenities
// function editSearchQuery(queries:string[], labels:string[]) {
//     let searchQuery = ''
//     for (let i = 0; i < queries.length;i++) {
//         if (queries[i] == "") {continue}
//         searchQuery += `${labels[i]}=${queries[i]}`
//     }
//     return searchQuery
// }

function build_query_conditionally(queryString:string|null, label:string, prevQueryValues:(string|null)[]) {
    if (queryString == null || queryString == '') {return ''}
    let queryBefore = false
    for (let pQ of prevQueryValues) {
        if (pQ != null && pQ != '') {queryBefore=true}
    }
    return `${queryBefore ? '&' : ''}${label}=${queryString}`
}

function enter_search(query:string, otherQueries:string) {
    const otherQueriesString = getOtherQueriesString(otherQueries)
    if (query == '' || query == null) {
        const urlstring = `/search${otherQueriesString == '' ? '' : `?${otherQueriesString}`}`
        goto(urlstring);
    } else {
        const urlstring = `/search?q=${query}${otherQueriesString != "" ? `&${otherQueriesString}` : ''}`;
        goto(urlstring);
    }
}

function pagination(query:string, pageNum:number) {

}

function getOtherQueriesString(fullQueryString:string) {
    if (fullQueryString == "") {return ""}
    if (fullQueryString.includes('q=') && (!fullQueryString.includes('&'))) {return ''}
    if (fullQueryString.includes('q=')) {return fullQueryString.slice(fullQueryString.indexOf('&')+1, fullQueryString.length)}
    return fullQueryString
}

function parseAmenitiesQuery(queryString:string|null) {
    // Since amenities is multivalued (and you can search by multiple amenities), we delimit the querystring with ;
    if (!queryString) {return undefined}
    const amenities:string[] = queryString.split(';').filter(am => am != '')
    return amenities
}

function parsePriceRange(queryString:string|null) {
    if (!queryString) {return undefined}
    const priceRange = queryString.split("-")
    if (priceRange.length > 2 || priceRange.length <= 1) {return undefined}
    const formatted = priceRange.map(s => parseInt(s));
    if (isNaN(formatted[0]) || (isNaN(formatted[1]) && !(priceRange[1] == 'inf'))) {return undefined}
    if (priceRange[1] != 'inf' && formatted[0] > formatted[1]) {return undefined}
    return {min: formatted[0], max: priceRange[1] == 'inf' ? 'inf' : formatted[1]}
}

export {
    enter_search, parseAmenitiesQuery, parsePriceRange,
    getNewRatingQuery, getNewPriceRangeQuery, getNewAmenitiesQuery, build_query_conditionally
}