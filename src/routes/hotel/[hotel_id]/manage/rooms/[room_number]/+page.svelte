<script lang="ts">
    import Tag from "$lib/components/tag.svelte";
    import { parse_date, parseYear } from "$lib/partial/ui/parse_date.js";
    import Button from "$lib/components/button.svelte";
    import Problemblock from "$lib/partial/ui/problemblock.svelte";
    import { goto, invalidateAll } from "$app/navigation";
    import { isToday } from "date-fns";
    import { addNotification } from "$lib/notificationStore.js";

    let {
        data
    } = $props()

    const check_customer = async(aId:string, is_check_in:boolean) => {
        const res = await fetch(`/hotel/${data.hotel_id}/manage/rooms/${data.room.room_number}`,
            {
                method: 'PUT',
                body: JSON.stringify({archiveId: aId, is_check_in})
            }
        ).then(r => r.json())
        if (res.success) {
            addNotification({body: `${is_check_in ? 'Checked in' : 'Checked out'} the customer!`, success:true, errorStatus:201})
            invalidateAll()
        } else {
            addNotification({body: `An error occurred!`, success:false, errorStatus:403})
        }
    }


</script>

<div class='flex flex-col justify-start ml-3'>
    <p class='text-[18px] mt-5'><span class='font-bold'>Room Number: </span> {data.room.room_number}</p>
    <p class='text-[18px]'><span class='font-bold'>Price per night: </span> ${data.room.price} per night</p>
    <p class='text-[18px]'><span class='font-bold'>Capacity: </span> {data.room.capacity} Bed</p>
    {#if (data.room.view)}<p class='text-[18px]'><span class='font-bold'>View: </span> {data.room.view[0].toUpperCase()+data.room.view.slice(1, data.room.view.length)}</p>{/if}
    <p class='text-[18px]'><span class='font-bold'>Extension Possible: </span> {data.room.extension_possible ? 'Yes' : 'No'}</p>
    <div class='flex flex-row items-center gap-2 w-[90%]'>
        <p class='text-[18px]'><span class='font-bold'>Amenities: </span></p>
        <p>
            {#each (data.room.amenities) as amenity}
                <Tag text={amenity} classes='text-wrap'/>
            {:else}
                None
            {/each}
        </p>
    </div>
    <div class='flex flex-row gap-2 mt-5'>
        {#if (data.room.can_rent)}<Button buttonClasses='hover:bg-cyan-300 bg-cyan-100 p-1 rounded-lg border border-black' onClick={() => goto(`/hotel/${data.hotel_id}/manage/rooms/${data.room.room_number}/rent`)}>Rent out Room</Button>{/if}
        {#if (data.user.is_manager)}
            <Button 
                buttonClasses='hover:bg-cyan-300 bg-cyan-100 p-1 rounded-lg border border-black' 
                onClick={() => goto(`/hotel/${data.hotel_id}/manage/rooms/${data.room.room_number}/update`)}
            >
                Update Room
            </Button>
            <Button 
                buttonClasses='hover:bg-cyan-300 bg-cyan-100 p-1 rounded-lg border border-black' 
                onClick={() => goto(`/hotel/${data.hotel_id}/manage/rooms/${data.room.room_number}/delete`)}
            >
                Delete Room
            </Button>
        {/if}
    </div>
    <p class='text-[24px] mt-5'><span class='font-bold'>Currently Staying:</span> </p>
        {#if (data.room_current_stay)}
            <div class='flex flex-row justify-start gap-10 items-center'>
                <p class='text-[18px] font-bold'>{data.room_current_stay.first_name ? `${data.room_current_stay.first_name} ${data.room_current_stay.middle_name} ${data.room_current_stay.last_name}` : 'Unknown'}</p>
                <p class='text-[18px] font-bold'>{parse_date(data.room_current_stay.stay_start_date)} {parseYear(data.room_current_stay.stay_end_date)} - {parse_date(data.room_current_stay.stay_end_date)} {parseYear(data.room_current_stay.stay_end_date)}</p>
                <Button 
                    buttonClasses='bg-cyan-100 p-1 rounded-lg border border-black'
                    onClick={() => check_customer(data.room_current_stay.archive_id, false)}
                >
                    Check out
                </Button>
            </div>
        {:else}
        <p class='text-[14px] italic text-gray text-center'>None</p>
        {/if}
    <p class='text-[24px] mt-5'><span class='font-bold'>Upcoming Stays</span> </p>
    {#each data.room_stays as stay}
        <div class='flex flex-row justify-start gap-10 items-center'>
            <p class='text-[18px] font-bold'>{stay.first_name ? `${stay.first_name} ${stay.middle_name} ${stay.last_name}` : 'Unknown'}</p>
            <p class='text-[18px] font-bold'>{parse_date(stay.stay_start_date)} {parseYear(stay.stay_end_date)} - {parse_date(stay.stay_end_date)} {parseYear(stay.stay_end_date)}</p>
            {#if (isToday(stay.stay_start_date))}
                <Button 
                    buttonClasses='bg-cyan-100 p-1 rounded-lg border border-black'
                    onClick={() => check_customer(stay.archive_id, true)}
                >
                    Check in
                </Button>
            {/if}
        </div>
    {:else}
        <p class='text-[14px] italic text-gray text-center'>None</p>
    {/each}
    <p class='text-[24px] mt-5'><span class='font-bold'>Ongoing Problems</span> </p>
    {#each data.room_problems as p}
        <Problemblock 
            display_room_num={false}
            problem_data={p}
        />
    {:else}
        <p class='text-[14px] italic text-gray text-center'>None</p>
    {/each}
</div>
