<script lang="ts">
    import { goto, invalidateAll } from '$app/navigation';
    import Button from '$lib/components/button.svelte';
    import { addNotification } from '$lib/notificationStore.js';


    let {data} = $props()

</script>

<div class='flex flex-col justify-start ml-3'>
    <p class='text-[24px]'><span class='font-bold'>Basic Hotel Information</span></p>
    <p class='text-[18px]'><span class='font-bold'>Hotel ID: </span> {data.hotel.address_id}</p>
    <p class='text-[18px] mt-5'><span class='font-bold'>Street: </span> {data.hotel.street_number} {data.hotel.street_name}</p>
    <p class='text-[18px]'><span class='font-bold'>Postal Code: </span> {data.hotel.postal_code}</p>
    <p class='text-[18px]'><span class='font-bold'>Location: </span> {data.hotel.city}, {data.hotel.state}, {data.hotel.country}</p>
    <div class="w-[300px] min-w-[300px] flex flex-col mt-5">
        {#if (data.hotel.emails != null)}
            <div class="w-[100%] flex">
                <p class='text-[12px] min-w-[93px] w-[35%] text-end'>Contact E-mail(s): </p>
                <p class='text-[12px] w-[65%] text-end'>{data.hotel.emails[0]}</p>
            </div>
            {#each (data.hotel.emails.length < 1 ? [] : data.hotel.emails.slice(1, data.hotel.emails.length)) as extra_email}
                <p class='text-[12px] text-end'>{extra_email}</p>
            {/each}
        {:else}
            <p class='text-[12px] italic'>No contact e-mails</p>
        {/if}
        {#if (data.hotel.phone_numbers != null)}
            <div class="w-[100%] flex">
                <p class='text-[12px] min-w-[103px] w-[35%] text-end'>Contact Number(s): </p>
                <p class='text-[12px] w-[65%] text-end'>{data.hotel.phone_numbers[0]}</p>
            </div>
            {#each (data.hotel.phone_numbers.length < 1 ? [] : data.hotel.phone_numbers.slice(1, data.hotel.phone_numbers.length)) as extra_number}
                <p class='text-[12px] text-end'>{extra_number}</p>
            {/each}
        {:else}
            <p class='text-[12px] italic'>No contact phone numbers</p>
        {/if}
    </div>
    {#if data.user.is_manager}
    <Button buttonClasses='p-2 bg-indigo-200 rounded-lg mt-5 w-[150px] hover:bg-indigo-300' onClick={() => goto(`/hotel/${data.hotel_id}/manage/hotel/edit`)}>Edit Information</Button>
    <div class='flex flex-col mt-20'>
        <Button buttonClasses='p-2 bg-red-200 hover:bg-red-300 border border-black rounded-lg w-[150px]' onClick={() => goto(`/hotel/${data.hotel_id}/manage/hotel/delete`)}>Delete Hotel</Button>
    </div>
    {/if}
</div>