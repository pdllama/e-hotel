<script lang="ts">
    import { goto } from '$app/navigation';
    import placeholder from '$lib/assets/placeholder.png'
    import Button from '$lib/components/button.svelte';

    let {
        data
    } = $props()
</script>


<div class="max-w-[1000px] size-full flex flex-col justify-center items-center gap-2">
    <div class="w-[100%] flex align-center justify-center gap-10">
        <img src={placeholder} width={"300px"} height={"300px"} alt="placeholder" class="opacity-75"/>
        <div class="flex flex-col w-[100%] justify-center">
            <p class="font-bold text-[36px]">{data.chain.chain_name}</p>
            <div class='flex flex-row items-center gap-2'><p class="text-[24px] nowrap min-w-[150px]">Central Office: </p> <p class="text-[20px]">{data.chain.street_number} {data.chain.street_name}, {data.chain.postal_code} | {data.chain.city}, {data.chain.state}, {data.chain.country}</p></div>
            <p class='text-[20px]'><span class="text-[28px] font-bold text-center">{data.chain.num_hotels}</span> total hotels</p>
            <Button buttonClasses="p-2 hover:bg-cyan-200 bg-cyan-100 border border-black max-w-[150px] rounded-lg" onClick={() => goto(`/search?q=${data.chain.chain_name}`)}> See Hotels </Button>
        </div>
    </div>
    <div class="w-[100%] flex align-center gap-2">
        <div class="w-[300px] min-w-[300px] flex flex-col">
            <div class="w-[100%] flex">
                <p class='text-[12px] min-w-[93px] w-[35%] text-end'>Contact E-mail(s): </p>
                <p class='text-[12px] w-[65%] text-end'>{data.chain.emails[0]}</p>
            </div>
            {#each data.chain.emails.slice(1, data.chain.emails.length) as extra_email}
                <p class='text-[12px] text-end'>{extra_email}</p>
            {/each}
            <div class="w-[100%] flex">
                <p class='text-[12px] min-w-[103px] w-[35%] text-end'>Contact Number(s): </p>
                <p class='text-[12px] w-[65%] text-end'>{data.chain.phone_numbers[0]}</p>
            </div>
            {#each data.chain.phone_numbers.slice(1, data.chain.phone_numbers.length) as extra_number}
                <p class='text-[12px] text-end'>{extra_number}</p>
            {/each}
        </div>
    </div>
</div>