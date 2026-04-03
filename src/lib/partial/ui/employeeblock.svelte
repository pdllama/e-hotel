<script lang='ts'>
    import profile from "$lib/assets/user-profile-black.png"
    import Button from "$lib/components/button.svelte";
    import { displayDate } from "./parse_date";

    let {
        employee,
        manager_view=false,
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
    <img src={profile} width={height} height={height} alt='placeholder'/>
    <div class='flex flex-col justify-start items-start w-[100%] '>
        <p class={`text-[24px] font-bold`}>{employee.first_name} {employee.middle_name} {employee.last_name}</p> 
        <p class='text-[18px]'>
            {employee.role}
        </p>
        {#if manager_view}<p class='text-[12px]'>${employee.pay}{employee.pay_struct == 'hourly' ? ' per hour' : ' annually'}</p>{/if}
    </div>
</Button>
{:else} 
<div
    class={`w-[${width}] h-[${height}] flex flex-row justify-start items-center gap-2`}
>
    <img src={profile} width={height} height={height} alt='placeholder'/>
    <div class='flex flex-col justify-start items-start w-[100%]'>
        <p class={`text-[24px] font-bold`}>{employee.first_name} {employee.middle_name} {employee.last_name}</p> 
        <p class='text-[18px] my-[-5px]'>
            {employee.role}
        </p>
         {#if manager_view}<p class='text-[12px]'>${employee.pay}{employee.pay_struct == 'hourly' ? ' per hour' : ' annually'}</p>{/if}
    </div>
</div>
{/if}