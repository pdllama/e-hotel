<script lang='ts'>
    import { goto } from '$app/navigation';
    import Archiveblock from '$lib/partial/ui/archiveblock.svelte';
    import Button from '$lib/components/button.svelte';


    let {
        data
    } = $props()

    //upcomingBookings,
        // currentRentals, 
        // pastStays,
        // cancelledBookings
</script>

<div class='flex flex-col gap-2 p-5 mb-2'>
    <p class='text-[32px] font-bold'>Upcoming Bookings</p>
    <div class='flex flex-col gap-1'>
        {#each data.upcomingBookings.slice(0, 3) as upB}
            <Archiveblock status={upB.status} archive_data={upB} onClick={() => goto(`/user/${data.user.SSN}/bookings/${upB.archive_id}`)}/>
        {:else}
            <p class='w-[100%] text-center italic text-gray text-[14px]'>No Upcoming Bookings</p>
        {/each}
        {#if data.upcomingBookings.length > 3}
            <p class='italic text-[16px]'>... {data.upcomingBookings.length -3} other bookings</p>
            <Button 
                buttonClasses="p-2 bg-cyan-100 rounded-lg w-[200px] border border-black hover:bg-cyan-300 cursor-pointer"
                onClick={() => goto(`/user/${data.user.ssn}/bookings/search?status='booked'`)}
            >
                <p>See All Bookings</p>
            </Button>
        {/if}
    </div>
    <p class='text-[32px] font-bold'>Ongoing Stays</p>
    <div class='flex flex-col gap-1'>
        {#each data.currentRentals.slice(0, 3) as upB}
            <Archiveblock status={upB.status} archive_data={upB} onClick={() => goto(`/user/${data.user.SSN}/bookings/${upB.archive_id}`)}/>
        {:else}
            <p class='w-[100%] text-center italic text-gray text-[14px]'>No Ongoing Stays</p>
        {/each}
        {#if data.upcomingBookings.length > 3}
            <p class='italic text-[16px]'>... {data.upcomingBookings.length -3} other ongoing stays</p>
        {/if}
    </div>
    <Button 
        buttonClasses="p-2 bg-cyan-100 rounded-lg w-[200px] border border-black hover:bg-cyan-300 cursor-pointer mt-2"
        onClick={() => goto(`/user/${data.user.SSN}/bookings/search`)}
    >
        <p>See All Records</p>
    </Button>
</div>





