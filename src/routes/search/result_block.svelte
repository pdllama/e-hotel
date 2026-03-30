<script lang="ts">
    import placeholder from "$lib/assets/placeholder.png"
    import {Rating} from "flowbite-svelte"
    import { goto } from "$app/navigation";
    import Tag from "$lib/components/tag.svelte";
    let {hotel} = $props()

</script>

<button 
    class="w-[100%] max-w-[800px] h-[120px] pl-2 flex justify-start items-center cursor-pointer hover:bg-gray-300 text-start" 
    onclick={() => {goto(`/hotel/${hotel.address_id}`)}}
>
    <img src={placeholder} alt="placeholder" width={"120px"} height={"120px"}/>
    <div class="flex flex-col size-full ml-3">
        <p class="font-bold text-[18px] mt-1">{hotel.chain_name}</p>
        <div class="flex w-[100%] items-center gap-2">
            <p class="text-[12px]">{hotel.city}, {hotel.country}</p> 
            <div class="ml-[-4px] my-[-4px] bg-slate-700 w-[102px] rounded"><Rating total={5} size={20} rating={hotel.avg_rating}/></div>
        </div>
        <p class='mt-[-4px]'><span class="text-[20px] font-bold text-center">{Math.round(hotel.avg_price)}</span>$ avg price</p>
        {#if (hotel.amenities[0] != null)}
        <p class="flex text-center items-center gap-1 w-[80%] text-ellipsis whitespace-nowrap overflow-hidden">
            {#each hotel.amenities.slice(0, 3) as amenity}
                <Tag text={amenity} classes='text-[12px] text-ellipsis inline-block shrink mr-[4px]'/>  
            {/each}
            {#if (hotel.amenities.length > 3)}
                <span>...</span>
            {/if}
        </p>
        {#if (hotel.amenities.length > 3)}
            <p class="flex text-center items-center gap-1 w-[80%] text-ellipsis whitespace-nowrap overflow-hidden">
                {hotel.amenities.length-3} other amenities
            </p>
        {/if}
        {:else}
            <p class='text-[18px] italic text-gray-500'>No Amenities</p>
        {/if}
        
        
    </div>
</button>