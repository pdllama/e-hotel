<script lang='ts'>
    import error from "$lib/assets/error.png"
    import Button from "$lib/components/button.svelte";
    import { displayDate } from "./parse_date";

    let {
        problem_data, 
        list_status=true,
        display_room_num=true,
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
    <img src={error} width={height} height={height} alt='placeholder'/>
    <div class='flex flex-col justify-start items-start w-[100%]'>
        {#if (display_room_num)}<p class='text-[24px] font-bold'>{`Room ${problem_data.room_number}`}</p>{/if}
        <p class={`${display_room_num ? 'text-[14px]' : 'text-[24px]'} font-bold`}>{problem_data.type[0].toUpperCase()}{problem_data.type.slice(1, problem_data.type.length)} Problem{list_status ? ` ${problem_data.status[0]}${problem_data.status.slice(1, problem_data.status.length)}` : ''}</p> 
        <p class='text-[14px]'>
            {problem_data.description}
        </p>
        <p class='text-[12px] font-bold'>Logged: {displayDate(problem_data.log_date, undefined, true)}</p>
    </div>
</Button>
{:else} 
<div
    class={`w-[${width}] h-[${height}] flex flex-row justify-start items-center gap-2`}
>
    <img src={error} width={height} height={height} alt='placeholder'/>
    <div class='flex flex-col justify-start items-start w-[100%]'>
         {#if (display_room_num)}<p class='text-[24px] font-bold'>{`Room ${problem_data.room_number}`}</p>{/if}
        <p class={`${display_room_num ? 'text-[14px]' : 'text-[24px]'} font-bold`}>{problem_data.type[0].toUpperCase()}{problem_data.type.slice(1, problem_data.type.length)} Problem{list_status ? ` ${problem_data.status[0]}${problem_data.status.slice(1, problem_data.status.length)}` : ''}</p> 
        <p class='text-[14px]'>
            {problem_data.description}
        </p>
        <p class='text-[12px] font-bold'>Logged: {displayDate(problem_data.log_date, undefined, true)}</p>
    </div>
</div>
{/if}