import { get_rand_arr_item, roll_chance_binary, roll_chance_multi } from "../seedingutils.ts"


const emaildomains = ["gmail.com", "outlook.com", "hotmail.com","yahoo.com","icloud.com","live.com"]

export function generateHotelEmails(
    hotel_size:string,
    hotel_city:string,
    chain_name:string
) {
    // lg size hotels will always have emails in the following format:
    //      <city>-info@<chain_name>.com
    //      <city>-booking@<chain_name>.com
    //      <city>-review@<chain_name>.com
    //  With the first always being chosen, 2nd or 3rd optional
    //  sm-md size hotels will always have:
    //      <chain>-info@<rand_domain>
    //      <chain>-booking@<rand_domain>
    //      <chain>-review@<rand_domain>

    const numEmails = roll_chance_multi([80, 15, 5], [1, 2, 3])
    const suffixes = ["info"]
    if (numEmails > 1) {
        const rolledSuffix = roll_chance_binary(50) ? "booking" : "review"
        suffixes.push(rolledSuffix);
        if (numEmails == 3) {suffixes.push(rolledSuffix == "booking" ? "review" : "booking")}
    }

    const formattedChainName = chain_name.toLowerCase().replaceAll(" ", "")
    const formattedCityName = hotel_city.toLowerCase().replaceAll(" ", "")

    const emails = []

    if (hotel_size == "lg") {
        for (let s of suffixes) {
            emails.push(`${formattedCityName}-${s}@${formattedChainName}.com`)
        }
    } else {
        for (let s of suffixes) {
            emails.push(`${formattedChainName}-${s}@${get_rand_arr_item(emaildomains)}`)
        }
    }

    return emails
}

export function generateChainEmails(
    chain_name: string
) {
    // Always central-info/service/billing@<chain_name>.com format

    const numEmails = roll_chance_multi([80, 15, 5], [1, 2, 3])
    const suffixes = ["info"]
    if (numEmails > 1) {
        const rolledSuffix = roll_chance_binary(50) ? "service" : "billing"
        suffixes.push(rolledSuffix);
        if (numEmails == 3) {suffixes.push(rolledSuffix == "service" ? "billing" : "service")}
    }
    const formattedChainName = chain_name.toLowerCase().replaceAll(" ", "")
    // const formattedCity = co_city.toLowerCase().replaceAll(" ", "")

    const emails = []

    for (let s of suffixes) {
        emails.push(`central-${s}@${formattedChainName}.com`)
    }

    return emails
}

export function generateHotelNumbers() {
    // Not even gonna worry about the length of phone numbers by country, etc. 
    // Just canadian/us standard 9 numbers for any hotel in any country.
    // note: it has to be a string in format (xxx) xxx-xxxx

    const numNumbers = roll_chance_multi([80, 15, 5], [1, 2, 3])

    const format = "(xxx) xxx-xxxx"
    const phoneNumbers = []

    for (let i = 0; i < numNumbers; i++) {
        
        let newStr = ""

        for (let c of format) {
            if (c != "x") {newStr+= c}
            else {newStr+= Math.floor(Math.random()*10)}
        }
        phoneNumbers.push(newStr)
    }

    return phoneNumbers
}