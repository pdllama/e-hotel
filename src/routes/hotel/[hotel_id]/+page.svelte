<script lang="ts">
    import type {PageData} from './$types.js'
    import { Rating } from 'flowbite-svelte';
    import placeholder from "$lib/assets/placeholder.png"
    import Tag from '$lib/components/tag.svelte';
    export let data : PageData
    
    const hotel = data.results
    
</script>

<div class="max-w-[1000px] size-full flex flex-col justify-center items-center gap-2">
    <div class="w-[100%] flex align-center justify-center gap-10">
        <img src={placeholder} width={"300px"} height={"300px"} alt="placeholder" class="opacity-75"/>
        <div class="flex flex-col w-[100%] justify-center ">
            <p class="font-bold text-[36px]">{hotel.chain_name}</p>
            <p class="text-[24px]">{hotel.city}, {hotel.state}, {hotel.country}</p>
            <p class="text-[20px]">{hotel.street_number} {hotel.street_name}, {hotel.postal_code}</p>
            <div class="my-1 bg-slate-700 w-[250px] rounded"><Rating total={5} size={50} rating={hotel.avg_rating}/></div>
            <p class='text-[20px]'><span class="text-[28px] font-bold text-center">{Math.round(hotel.avg_price)}</span>$ avg price</p>
            <p class='text-[20px]'><span class="text-[28px] font-bold text-center">{hotel.num_rooms}</span> total rooms</p>
        </div>
    </div>
    <div class="w-[100%] flex align-center gap-2">
        <div class="w-[300px] min-w-[300px] flex flex-col">
            <div class="w-[100%] flex">
                <p class='text-[12px] min-w-[93px] w-[35%] text-end'>Contact E-mail(s): </p>
                <p class='text-[12px] w-[65%] text-end'>{hotel.emails[0]}</p>
            </div>
            {#each hotel.emails.slice(1, hotel.emails.length) as extra_email}
                <p class='text-[12px] text-end'>{extra_email}</p>
            {/each}
            <div class="w-[100%] flex">
                <p class='text-[12px] min-w-[103px] w-[35%] text-end'>Contact Number(s): </p>
                <p class='text-[12px] w-[65%] text-end'>{hotel.phone_numbers[0]}</p>
            </div>
            {#each hotel.phone_numbers.slice(1, hotel.phone_numbers.length) as extra_number}
                <p class='text-[12px] text-end'>{extra_number}</p>
            {/each}
        </div>
        <div class={`w-full flex flex-col justify-${hotel.amenities[0] == null ? 'center' : 'start'} items-center`}>
            {#if (hotel.amenities[0] != null)}
            <p class="flex text-center items-center gap-1 flex-wrap">
                {#each hotel.amenities as amenity}
                    <Tag text={amenity}/>  
                {/each}
            </p>
            {:else}
                <p class='text-[30px] italic text-gray-500'>No Amenities</p>
            {/if}
        </div>
    </div>
    To-do: book room (form, view rooms, etc), recent reviews
</div>