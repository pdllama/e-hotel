<script lang="ts">
    import InteractableStars from "$lib/components/interactablestars.svelte";
    import { page } from "$app/stores";
    import { build_query_conditionally, enter_search, getNewAmenitiesQuery, getNewPriceRangeQuery, getNewRatingQuery, parseAmenitiesQuery, parsePriceRange } from "./search_logic";
    import Button from "$lib/components/button.svelte";

    let {
        width='20%', height='100%', currentQ=null
    } = $props()

    const minRating = $page.url.searchParams.get('rating')
    const priceRange = $page.url.searchParams.get('price')
    const amenities = $page.url.searchParams.get('amenities')

    const initMinRating = (!minRating || isNaN(parseInt(minRating))) ? 1 : parseInt(minRating)
    const initPriceRange = parsePriceRange(priceRange)
    const initAmenities = parseAmenitiesQuery(amenities)
    let states = $state({minRating: initMinRating, priceRange: !initPriceRange ? {min: 0, max: 0} : initPriceRange, amenities: !initAmenities ? [] : initAmenities})

    const handleRatingQuery = (starNum:number) => {
        const newRatingQuery = getNewRatingQuery(starNum);
        states = {...states, minRating: starNum}
        const priceRangeQuery = getNewPriceRangeQuery(states.priceRange)
        const amenitiesQuery = getNewAmenitiesQuery(states.amenities)
        enter_search(
            currentQ, 
            `${newRatingQuery}${build_query_conditionally(priceRangeQuery, 'price', [newRatingQuery])}${build_query_conditionally(amenitiesQuery, 'amenities', [newRatingQuery, priceRangeQuery])}`
        )
    }

    const handlePriceRangeQuery = (e:MouseEvent, min:number, max:number|string) => {
        const target = e.target as HTMLInputElement
        const reset = !target.checked
        const newPriceRangeQuery = reset ? '' : getNewPriceRangeQuery({min, max});
        states = {...states, priceRange: {min: reset ? 0 : min, max: reset ? 0 : max}}
        const ratingQuery = states.minRating > 1 ? `rating=${states.minRating}` : ''
        const amenitiesQuery = getNewAmenitiesQuery(states.amenities)
        enter_search(
            currentQ, 
            `${ratingQuery}${build_query_conditionally(newPriceRangeQuery, 'price', [ratingQuery])}${build_query_conditionally(amenitiesQuery, 'amenities', [ratingQuery, newPriceRangeQuery])}`
        )
    }

    const handleAmenityQuery = (am:string) => {
        const newAmenitiesState = states.amenities.includes(am) ? states.amenities.filter(a => a != am) : [...states.amenities, am]
        const newAmenitiesQuery = getNewAmenitiesQuery(newAmenitiesState);
        states = {...states, amenities: newAmenitiesState}
        const ratingQuery = states.minRating > 1 ? `rating=${states.minRating}` : ''
        const priceRangeQuery = getNewPriceRangeQuery(states.priceRange)
        enter_search(
            currentQ, 
            `${ratingQuery}${build_query_conditionally(priceRangeQuery, 'price', [ratingQuery])}${build_query_conditionally(newAmenitiesQuery, 'amenities', [ratingQuery, priceRangeQuery])}`
        )
    }


    const priceRanges = [{min: 51, max: 100}, {min: 101, max: 150}, {min: 151, max: 200}, {min:201, max: 250}, {min: 251, max: 300}, {min: 301, max: 350}, {min: 351, max: 400}, {min: 400, max: 'inf'}]
    const amenityOptions = [
        'Air Conditioning', 'Heating', 'Wi-Fi', 'Television', 'Mini Bar', 'Refrigerator', 'Coffee Maker', 'Safe', 'Desk', 'Seating Area', 
        'Room Service', 'Hair Dryer', 'Toiletries', 'Bathrobe', 'Slippers', 'Bathtub', 'Iron', 'Closet', 'Soundproofing', 'Electric Kettle',
        'Microwave', 'Alarm Clock', 'Laptop Safe', 'Universal Power Outlets', 'Streaming Services', 'Room Lighting Control', 'Telephone with Voicemail',
        'Intercom', 'WiFi Printer', 'LED Mood Lighting', 'Charging Stations', 'Bluetooth Speaker', 'Streaming HDMI Ports', 'Welcome Snacks', 
        'Coffee & Tea Supplies', 'Complimentary Bottled Water', 'Eco-friendly Amenities', 'Baby Cot', 'Extra Bed', 'Wheelchair Accessible', 'Pet-Friendly',
        'Hypoallergenic Bedding', 'Blackout Curtains', 'Balcony'
    ]

</script>

<div class={`w-[${width}] h-[${height}] flex flex-col align-center justify-start gap-3`}>
    <div class='w-[100%] h-250px'>
        <p class='text-[20px] font-bold'>Rating</p>
        <div class='flex'>
            <InteractableStars ratingNum={states.minRating} onClick={handleRatingQuery}/>
        </div>
    </div>
    <div class='w-[100%]'>
        <p class='text-[20px] font-bold mb-2'>Price Range</p>
        <div class='flex flex-col gap-3'>
            {#each priceRanges as pr}
                <div class='flex gap-1 justify-start align-center'>
                    <input 
                        type='checkbox' 
                        checked={pr.min == states.priceRange.min && pr.max == states.priceRange.max} 
                        class='cursor-pointer' 
                        onchange={(e:any) => handlePriceRangeQuery(e, pr.min, pr.max)}
                    />
                    <p class='font-bold text-[14px]'>${pr.min}{pr.max == 'inf' ? '+' : ` - $${pr.max}`}</p>
                </div>
            {/each}
        </div>
    </div>
    <div class='w-[100%]'>
        <p class='text-[20px] font-bold mb-2'>Amenities</p>
        <div class='flex flex-col gap-3'>
            {#each amenityOptions.slice(0, 10) as am}
                <div class='flex gap-1 justify-start align-center'>
                    <input 
                        type='checkbox' 
                        checked={states.amenities.includes(am)} 
                        class='cursor-pointer' 
                        onchange={() => handleAmenityQuery(am)}
                    />
                    <p class='font-bold text-[14px]'>{am}</p>
                </div>
            {/each}
            <Button buttonClasses="p-4 bg-cyan-200 hover:bg-cyan-300 rounded-lg">
                <span class='font-bold italic'>More Amenities</span>
            </Button>
        </div>
    </div>
</div>