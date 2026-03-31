<script>
    import { goto } from '$app/navigation';
    import ResultBlock from '../../../search/result_block.svelte';


    let {
        data
    } = $props()
</script>

<div class='flex flex-col ml-3 p-1'>
    <p class='text-[24px] font-bold mb-3'>You are employed at the following hotels (Click to manage it):</p>
    {#each data.employedData as employedHotel}
        <ResultBlock hotel={employedHotel} brief street role customOnClick={() => goto(`/hotel/${employedHotel.address_id}/manage`)}/>
    {/each}
</div>