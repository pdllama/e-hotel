<script lang="ts">
    import { goto } from "$app/navigation";
    import Archiveblock from "$lib/partial/ui/archiveblock.svelte";
    import Button from "$lib/components/button.svelte";
    import Problemblock from "$lib/partial/ui/problemblock.svelte";

    let {
        data
    } = $props()

</script>

<div class='flex flex-col gap-2 p-5 mb-2'>
    <p class='text-[32px] font-bold'>Upcoming Bookings</p>
    <div class='flex flex-col gap-1'>
        {#each data.upcomingBookings.slice(0, 3) as upB}
            <Archiveblock status={upB.status} archive_data={upB} is_user_page={false} onClick={() => goto(`/hotel/${data.hotel_id}/manage/archives/${upB.archive_id}`)}/>
        {:else}
            <p class='w-[100%] text-center italic text-gray text-[14px]'>No Upcoming Bookings</p>
        {/each}
        {#if data.upcomingBookings.length != 0 && data.upcomingBookings[0].totalCount > 3}
            <p class='italic text-[16px]'>... {data.upcomingBookings[0].totalCount } other bookings</p>
            <Button 
                buttonClasses="p-2 bg-cyan-100 rounded-lg w-[200px] border border-black hover:bg-cyan-300 cursor-pointer"
                onClick={() => goto(`/hotel/${data.hotel_id}/manage/archives?status='booked'`)}
            >
                <p>See All Bookings</p>
            </Button>
        {/if}
    </div>
    <p class='text-[32px] font-bold'>Ongoing Stays</p>
    <div class='flex flex-col gap-1'>
        {#each data.currentRentals.slice(0, 3) as upB}
            <Archiveblock status={upB.status} archive_data={upB} is_user_page={false} onClick={() => goto(`/hotel/${data.hotel_id}/manage/archives/${upB.archive_id}`)}/>
        {:else}
            <p class='w-[100%] text-center italic text-gray text-[14px]'>No Ongoing Stays</p>
        {/each}
        {#if data.currentRentals.length != 0 && data.currentRentals[0].totalCount > 3}
            <p class='italic text-[16px]'>... {data.currentRentals[0].totalCount} other ongoing stays</p>
            <Button 
                buttonClasses="p-2 bg-cyan-100 rounded-lg w-[200px] border border-black hover:bg-cyan-300 cursor-pointer"
                onClick={() => goto(`/hotel/${data.hotel_id}/manage/archives?status='renting'`)}
            >
                <p>See All Stays</p>
            </Button>
        {/if}
    </div>
    <Button 
        buttonClasses="p-2 bg-cyan-100 rounded-lg w-[200px] border border-black hover:bg-cyan-300 cursor-pointer mt-2"
        onClick={() => goto(`/hotel/${data.hotel_id}/manage/archives`)}
    >
        <p>See All Records</p>
    </Button>
    <p class='text-[32px] font-bold'>Ongoing Room Problems</p>
    <div class='flex flex-col gap-1'>
        {#each data.problems as p}
            <Problemblock problem_data={p} list_status={false}/>
        {:else}
            <p class='w-[100%] text-center italic text-gray text-[14px]'>No Ongoing Room Problems</p>
        {/each}
        {#if data.problems.length != 0 && data.problems[0].totalCount > 3}
            <p class='italic text-[16px]'>... {data.problems[0].totalCount} other ongoing stays</p>
        {/if}
    </div>
    {#if data.problems.length != 0 && data.problems[0].totalCount > 3}
    <Button 
        buttonClasses="p-2 bg-cyan-100 rounded-lg w-[200px] border border-black hover:bg-cyan-300 cursor-pointer mt-2"
        onClick={() => goto(`/hotel/${data.hotel_id}/manage/problems?status='ongoing'`)}
    >
        <p>See All Ongoing Problems</p>
    </Button>
    {/if}
</div>

