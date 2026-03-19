import type { Hotel_Assignment, Chain_Assignment, City_Stats } from './../seedingutils.ts';
import { get_rand_idx, roll_chance_binary, roll_chance_multi } from './../seedingutils.ts';
import {default as chain_name_data} from "./../seeding data/hotel/chain-data.json" with {type:'json'} 
import {v4 as uuidv4} from 'uuid';

const chainNamesByLang:{[key:string]: Set<string>} = {}

type ChainType = typeof chain_name_data
const lang_codes : string[] = Object.keys(chain_name_data)

for (let lang of lang_codes as (keyof ChainType)[]) {
    const chains = chain_name_data[lang]
    const setVer = new Set(chains);
    chainNamesByLang[lang] = setVer
}

export function seed_city(
    chains:Chain_Assignment[],
    city_stats:{[key: string]: City_Stats},
    city:string,
    other_cities_in_country_with_hotels:string[] //used for existing local chains
) {
    // 70% chance to have 3 hotels in the city, 25% chance to have 4 hotels, 5% chance to have 5 hotels.
    // But we have to check if an international chain had setup in that city already.
    const currentNumHotels = city_stats[city].num_hotels
    let finalNumHotels = roll_chance_multi([70, 25, 5], [3, 4, 5]); // The final number that it will be

    const additionalHotels = finalNumHotels - currentNumHotels // The number of hotels we have to add.

    for (let i=0;i<additionalHotels;i++) {
        // The first hotel in a city will always be a NEW local hotel chain.
        decide_hotel_chain(city_stats, city, other_cities_in_country_with_hotels, chains, i == 0)
    }
}

function decide_hotel_chain(
    city_stats:{[key: string]: City_Stats}, 
    city:string, 
    other_cities_in_country_with_hotels:string[], 
    chains:Chain_Assignment[],
    force_local: boolean
) {
    // Decides the following:
    //  1. Whether the hotel is from an international chain or local chain (local as in within the same country)
    //  2. Whether the hotel will be from a new chain or a previously created chain.

    // Note that the same chain cannot have 2 hotels in the same city.

    // Here are the odds of each possibility and the decision order:
        // 1. 75% chance to be local, 25% chance to be intl chain
        // 2. if local, 90% chance to be a new chain and 10% chance to be an existing chain. 
        //      If it is an existing chain, then it will:
        //          a. Create a list of all local chains in the country that aren't in the current city
        //          b. If this list has length >= 1 (aka theres an existing local chain that hasnt been established in the city), we randomly select from this list
        //          c. if that list is empty, then default to creating a new local chain
        //      If its a new chain then it will just generate a new chain and add it to that city.
        // 3. if intl, 80% chance to be an existing chain, and 20% chance to be a new intl chain
        //      If it is an existing chain, then it will:
        //          a. Create a list of all international chains across countries, excluding an intl chain already in the current city
        //          b. If this list is not 0, randomly select one to adopt
        //          c. if this list is empty, create a new intl chain instead
        //      If it is a new chain, then it will:
        //          a. Create a hotel in the current city
        //          b. Randomly select from cities in other countries with only less than 5 hotels and create a hotel there. 
        //              If by some freak statistical anomaly there's none, then it will just be a local chain
    
    const isLocal = roll_chance_binary(75);
    if (isLocal || force_local) {
        const isNewChain = roll_chance_binary(90);
        const mustBeNewChain = isNewChain || other_cities_in_country_with_hotels.length == 0
        const existingChain = mustBeNewChain ? undefined : getRandLocalChainNotInCity(city_stats, other_cities_in_country_with_hotels, chains)
        if (mustBeNewChain || existingChain == undefined) {
            // If there's no other cities and/or the other cities dont have hotels, then it has to be a new chain
            // Also, if the hotels in other cities are all international branches, then it also has to be a new chain

            const randLocalChainName = popRandom(chainNamesByLang[city_stats[city].lang]);
            chains.push({chain_name: randLocalChainName, size: "local", origin: city})
            city_stats[city].hotel_chains.push(randLocalChainName)
            city_stats[city].hotel_sizes.push(decide_hotel_size("local"))
            city_stats[city].hotel_address_uuid.push(uuidv4())
            city_stats[city].num_hotels+=1

        } else {
            // use existingChain data.
            chains.push({chain_name: existingChain, size: "local", origin: city})
            city_stats[city].hotel_chains.push(existingChain)
            city_stats[city].hotel_sizes.push(decide_hotel_size("local"))
            city_stats[city].hotel_address_uuid.push(uuidv4()) // Note: this uuid corresponds to the hotel address_id! Must be unique!
            city_stats[city].num_hotels+=1
        }
    } else {
        // international
        const isNewChain = roll_chance_binary(20);
        const existingIntlChain = isNewChain ? undefined : getRandIntlChain(city_stats[city].hotel_chains, chains)
        const mustBeNew = existingIntlChain == undefined

        if (isNewChain || mustBeNew) {
            const randIntlChainName = popRandom(chainNamesByLang[city_stats[city].lang]);
            const chain_info = {chain_name: randIntlChainName, size: "intl", origin: city}
            city_stats[city].hotel_chains.push(randIntlChainName),
            city_stats[city].hotel_address_uuid.push(uuidv4())
            city_stats[city].num_hotels+=1

            const expansionCity = getExpandedIntlCountry(city_stats, city)
            if (expansionCity == undefined) {
                // Aka theres no intl city to expand to, meaning itll just be a local chain only in its own city
                chain_info.size = "local"
                city_stats[city].hotel_sizes.push(decide_hotel_size("local"))
                chains.push(chain_info)
            } else {
                // aka expand the chain into another intl city
                chains.push(chain_info)
                city_stats[city].hotel_sizes.push(decide_hotel_size("intl"))

                city_stats[expansionCity].hotel_chains.push(randIntlChainName)
                city_stats[expansionCity].hotel_sizes.push(decide_hotel_size("intl"))
                city_stats[expansionCity].num_hotels+=1
            }
        } else {
            city_stats[city].hotel_chains.push(existingIntlChain)
            city_stats[city].hotel_sizes.push(decide_hotel_size("intl")),
            city_stats[city].hotel_address_uuid.push(uuidv4())
            city_stats[city].num_hotels+=1
        }
    }
}

function decide_hotel_size(chain_size:string) {//local or intl
    // Decides the hotel size (sm, md, lg). intl odds: 30% small, 50% md, 20% lg, local odds: 70% small, 25% md, 5% lg
    return roll_chance_multi(chain_size == "local" ? [70, 25, 5] : [30, 50, 20], ["sm", "md", "lg"])
}

function getRandLocalChainNotInCity(
    city_stats:{[key: string]: City_Stats}, 
    other_cities_in_country_with_hotels:string[],
    chains:Chain_Assignment[]
) {
    // This function will not fire if there's no hotels in the other cities, or if theres no other cities.
    // Therefore we just need to check if theres a local hotel chain in the other city and not international.

    const allApplicableLocalChains: string[] = []
    
    for (let c of other_cities_in_country_with_hotels) {
        city_stats[c].hotel_chains.forEach(ch => {
            const chData = chains.filter(chain => chain.chain_name == ch)[0];
            if (chData.size == "local") {
                allApplicableLocalChains.push(ch)
            }
        })
    }



    return allApplicableLocalChains[get_rand_idx(allApplicableLocalChains.length)] // can be undefined if theres no applicable local chain
} 

function getRandIntlChain( //not in city
    curr_city_chains:string[],
    chains:Chain_Assignment[]
) {
    const intlChains = chains.filter(ca => ca.size == "intl").map(ca => ca.chain_name);
    const applicableIntlChains = intlChains.filter(ch => !curr_city_chains.includes(ch));

    return applicableIntlChains[get_rand_idx(applicableIntlChains.length)] // can be undefined if theres no applicable intl chain
}

function popRandom(s:Set<string>) {
    const arr = Array.from(s);
    const randElement = arr[get_rand_idx(arr.length)];
    s.delete(randElement);
    return randElement
}

function getExpandedIntlCountry(
    city_stats:{[key: string]: City_Stats}, 
    city:string
) {
    // This function pulls a new country and new city to create a second hotel in for an international chain. 

    const intlCities: string[] = Object.keys(city_stats).filter(c => city_stats[c].country != city_stats[city].country && city_stats[c].num_hotels < 5)

    return intlCities[get_rand_idx(intlCities.length)] // can be undefined if theres no intl city meeting criteria
}