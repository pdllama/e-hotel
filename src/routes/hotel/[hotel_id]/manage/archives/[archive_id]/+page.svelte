<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "$lib/components/button.svelte";
    import Tag from "$lib/components/tag.svelte";
    import { getNumDays, parse_date, parseYear } from "$lib/partial/ui/parse_date.js";

    let {
        data
    } = $props()


</script>

<div class='flex flex-col justify-start ml-3'>
    <Button buttonClasses='p-1 bg-indigo-200 rounded-lg mt-1 mb-3 w-[150px] hover:bg-indigo-300' onClick={() => history.back()}>Back</Button>
    <p class='text-[24px]'><span class='font-bold'>{data.archive.status == 'booked' ? 'Upcoming Booking' : data.archive.status == 'renting' ? 'Ongoing Stay' : data.archive.status == 'completed' ? 'Past Stay' : 'Cancelled Booking'}</span></p>
    <p class='text-[18px] mt-5'><span class='font-bold'>Customer: </span> {data.archive.first_name == null ? '[DELETED]' : `${data.archive.first_name} ${data.archive.middle_name} ${data.archive.last_name}`}</p>
    <p class='text-[18px]'><span class='font-bold'>Stay Dates: </span> {parse_date(data.archive.stay_start_date)} {parseYear(data.archive.stay_end_date)} - {parse_date(data.archive.stay_end_date)} {parseYear(data.archive.stay_end_date)}</p>

    <p class='text-[18px] mt-5'><span class='font-bold'>Room Number: </span> {data.archive.room_number}</p>
    <p class='text-[18px]'><span class='font-bold'>Price: </span> ${data.archive.price} per night</p>
    <p class='text-[18px]'><span class='font-bold'>Total Price: ${getNumDays(data.archive.stay_start_date, data.archive.stay_end_date)*data.archive.price}</span></p>
    <p class='text-[18px]'><span class='font-bold'>Capacity: </span> {data.archive.capacity} Bed</p>
    {#if (data.archive.view)}<p class='text-[18px]'><span class='font-bold'>View: </span> {data.archive.view[0].toUpperCase()+data.archive.view.slice(1, data.archive.view.length)}</p>{/if}
    <p class='text-[18px]'><span class='font-bold'>Extension Possible: </span> {data.archive.extension_possible ? 'Yes' : 'No'}</p>
    <div class='flex flex-row items-center gap-2 w-[90%]'>
        <p class='text-[18px]'><span class='font-bold'>Amenities: </span></p>
        <p>
            {#each (data.archive.amenities) as amenity}
                <Tag text={amenity} classes='text-wrap'/>
            {:else}
                None
            {/each}
        </p>
    </div>
    {#if (data.archive.created_at)}
        <p class='text-[24px] mt-5'>
            <span class='font-bold'>
                Booking Information
            </span>
        </p>
        <p class='text-[18px]'><span class='font-bold'>Created: {data.archive.created_at}</span></p>
        <p class='text-[18px]'><span class='font-bold'>Paid on Booking: {data.archive.paid_for ? 'Yes' : 'No'}</span></p>
    {/if}

    {#if (data.archive.check_in_time)}
            <p class='text-[24px] mt-5'>
            <span class='font-bold'>
                Rental Information
            </span>
        </p>
        <p class='text-[18px]'><span class='font-bold'>Checked in at: {data.archive.check_in_time}</span></p>
        {#if (data.archive.status != 'renting')}<p class='text-[18px]'><span class='font-bold'>Checked out at: {data.archive.check_out_time}</span></p>{/if}
    {/if}
</div>