<script lang="ts">
    import { goto } from "$app/navigation";
    import TextInput from "$lib/components/text-input.svelte";
    import searchIcon from '$lib/assets/search-icon.png'
    import DestinationCard from "$lib/components/carousel/card-carousel/cards/destination-card.svelte";

    let {data} = $props()

    let c = $state(data.search_state)
</script>

<div class="flex flex-col size-full max-w-[1200px] justify-start items-center gap-2 relative">
    <p class='h1 text-[32px] font-bold'>Search Rooms by Area</p>
    <div class="flex w-[80%] items-center justify-center rounded-sm border border-black mx-2">
        <TextInput
            placeholder="Search Cities"
            nameId="city"
            divClasses="w-[100%] max-w-[1000px] h-[50px] bg-white rounded-lg"
            value={c}
            oninput={(e:HTMLInputElement) => {
                c = e.value;
            }}
            icon={searchIcon}
            iconAlt="search icon"
            clearHandler={() => {c = ''}}
            submitHandler={() => {goto(`hotels/by-area${c == '' ? '' : `?c=${c}`}`)}}
            submitText="SEARCH"
        />
    </div>

    <div class="size-full flex flex-wrap justify-center gap-5 my-8">
        {#each data.rooms_by_area as rba}
            <div class='min-h-[350px]'>
            <DestinationCard
                name={rba.city}
                country={rba.country}
                numHotels={rba.num_hotels}
                numAvailRooms={rba.num_avail_rooms}
                avgPrice={rba.avg_price}
                imgLink={rba.imgLink}
                onClick={() => goto(`/search?q=${rba.city}`)}
            />
            </div>
        {:else}
            <p class='text-[18px] italic'>No results found</p>
        {/each}
    </div>
</div>