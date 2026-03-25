<script lang="ts">
    import placeholder from "$lib/assets/placeholder.png"
    import {Rating} from "flowbite-svelte"
    import { goto } from "$app/navigation";
    let {
        item,
        change_search_input
    } = $props()

</script>

<button 
    class="w-[100%] h-[80px] pl-2 flex justify-start items-center cursor-pointer hover:bg-gray-300 text-start" 
    onclick={item.address_id == undefined ? 
        () => {change_search_input(item.city)} :
        () => {goto(`/hotel/${item.address_id}`)}
    }
>
    {#if (item.address_id == undefined)} 
        
        <div class="flex flex-col justify-center ml-3">
            <p class="font-bold text-[20px]">{item.city}</p>
            <p class="text-[12px]">City in {item.state}, {item.country}</p>
        </div>
    {:else}
        <img src={placeholder} alt="placeholder" width={"60px"} height={"60px"}/>
        <div class="flex flex-col size-full ml-3">
            <p class="font-bold text-[18px] mt-1">{item.chain_name}</p>
            <div class="flex w-[100%] items-center gap-2">
                <p class="text-[12px]">{item.city}, {item.country}</p> 
                <div class="ml-[-4px] my-[-4px] bg-slate-700 w-[102px] rounded"><Rating total={5} size={20} rating={item.avg_rating}/></div>
            </div>
            <p class='mt-[-4px]'><span class="text-[20px] font-bold text-center">{Math.round(item.avg_price)}</span>$ avg price</p>
            
            
        </div>
    {/if}
</button>