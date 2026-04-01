<script lang='ts'>
    import placeholder from "$lib/assets/placeholder.png"
    import Button from "$lib/components/button.svelte";
    import { getNumDays, parse_date, parseYear } from "./parse_date";

    let {
        status,
        is_user_page=true,
        archive_data, //as defined in archive_view database view. Note that the user page and hotel management page select different columns from that view
        width='100%',
        height='100px',
        onClick=null
    } = $props()

</script>

{#if (onClick)}
<Button 
    buttonClasses={`w-[${width}] h-[${height}] flex flex-row justify-start items-center gap-2 hover:bg-gray-200 cursor-pointer p-2 rounded-lg`}
    onClick={(e:MouseEvent) => onClick()}
>
    <img src={placeholder} width={height} height={height} alt='placeholder'/>
    <div class='flex flex-col justify-start items-start w-[100%]'>
        <p class='text-[24px] font-bold'>{is_user_page ? archive_data.chain_name : `Room ${archive_data.room_number}`}</p>
        {#if (is_user_page)}
            <p class='text-[14px]'>{archive_data.street_number} {archive_data.street_name} - {archive_data.city}, {archive_data.state}, {archive_data.country}</p>
        {/if}
        <p class='text-[14px]'>
                {#if (is_user_page)}Room {archive_data.room_number} -{/if}
                <span class='font-bold'>${archive_data.price}/night</span>, {archive_data.capacity} Bed, <span class='font-bold'>${getNumDays(archive_data.stay_start_date, archive_data.stay_end_date)*archive_data.price}</span> total
                
        </p>
        {#if (!is_user_page && archive_data.first_name)}
            <p class='text-[14px]'>Customer: {archive_data.first_name} {archive_data.middle_name} {archive_data.last_name}</p>
        {/if}
        <p class='text-[14px]'>
            {#if (archive_data.status == 'booked')}
                {parse_date(archive_data.stay_start_date)} {parseYear(archive_data.stay_end_date)} - {parse_date(archive_data.stay_end_date)} {parseYear(archive_data.stay_end_date)} [<span class='font-bold'>{archive_data.paid_for ? 'PAID' : 'UNPAID'}</span>]
            {:else if (archive_data.status == 'cancelled')}
                {parse_date(archive_data.stay_start_date)} {parseYear(archive_data.stay_end_date)} - {parse_date(archive_data.stay_end_date)} {parseYear(archive_data.stay_end_date)} [<span class='font-bold'>CANCELLED</span>]
            {:else}
                {archive_data.status == 'renting' ? 
                    `Until ${parse_date(archive_data.stay_end_date)}` 
                    : 
                    `${parse_date(archive_data.stay_start_date)} ${parseYear(archive_data.stay_start_date)} 
                    - 
                    ${parse_date(archive_data.stay_end_date)} ${parseYear(archive_data.stay_end_date)}`
                }
            {/if}
        </p>
    </div>
</Button>
{:else} 
<div
    class={`w-[${width}] h-[${height}] flex flex-row justify-start items-center gap-2`}
>
    <img src={placeholder} width={height} height={height} alt='placeholder'/>
    <div class='flex flex-col justify-start items-start w-[100%]'>
        <p class='text-[24px] font-bold'>{is_user_page ? archive_data.chain_name : `Room ${archive_data.room_number}`}</p>
        {#if (is_user_page)}
            <p class='text-[14px]'>{archive_data.street_number} {archive_data.street_name} - {archive_data.city}, {archive_data.state}, {archive_data.country}</p>
        {/if}
        <p class='text-[14px]'>
            {#if (is_user_page)}
                Room {archive_data.room_number} - <span class='font-bold'>${archive_data.price}</span>, {archive_data.capacity} Bed
            {:else}
                {archive_data.first_name} {archive_data.middle_name} {archive_data.last_name}
            {/if}
        </p>
        <p class='text-[14px]'>
            {#if (archive_data.status == 'booked')}
                {parse_date(archive_data.stay_start_date)} {parseYear(archive_data.stay_end_date)} - {parse_date(archive_data.stay_end_date)} {parseYear(archive_data.stay_end_date)} [<span class='font-bold'>{archive_data.paid_for ? 'PAID' : 'UNPAID'}</span>]
            {:else if (archive_data.status == 'cancelled')}
                {parse_date(archive_data.stay_start_date)} {parseYear(archive_data.stay_end_date)} - {parse_date(archive_data.stay_end_date)} {parseYear(archive_data.stay_end_date)} [<span class='font-bold'>CANCELLED</span>]
            {:else}
                {archive_data.status == 'renting' ? 
                    `Until ${parse_date(archive_data.stay_end_date)}` 
                    : 
                    `${parse_date(archive_data.stay_start_date)} ${parseYear(archive_data.stay_start_date)} 
                    - 
                    ${parse_date(archive_data.stay_end_date)} ${parseYear(archive_data.stay_end_date)}`
                }
            {/if}
        </p>
    </div>
</div>
{/if}