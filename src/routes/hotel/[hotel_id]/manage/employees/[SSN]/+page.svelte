<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "$lib/components/button.svelte";

    let {
        data
    } = $props()

    //const education = ['less_than_hs', 'hs', 'undergraduate', 'master', 'phd']

    const eduMapping = {
        'less_than_hs': 'Less than High School',
        'hs': 'High School',
        'undergraduate': 'Undergraduate Degree',
        'master': "Master's Degree",
        'phd': 'P.h.D.'
    }

    type eduMappingType = typeof eduMapping


</script>

<div class='flex flex-col justify-start ml-3'>
    <Button buttonClasses='p-1 bg-indigo-200 rounded-lg mt-1 mb-3 w-[150px] hover:bg-indigo-300' onClick={() => goto(`/hotel/${data.hotel_id}/manage/employees`)}>Back</Button>
    
    <p class='text-[24px]'><span class='font-bold'>Employee Information</span></p>
    <p class='text-[18px] mt-5'><span class='font-bold'>Name: </span> {data.employee.first_name} {data.employee.middle_name} {data.employee.last_name}</p>
    <p class='text-[18px] mt-5'><span class='font-bold'>Education Level: </span> {eduMapping[data.employee.education_level as keyof eduMappingType]}</p>
    <p class='text-[18px] mt-5'><span class='font-bold'>Role: </span> {data.employee.role}</p>
    {#if data.user.is_manager}
    <p class='text-[18px]'><span class='font-bold'>Pay:</span> ${data.employee.pay} {data.employee.pay_struct == 'hourly' ? 'per hour' : 'annually'}</p>
    {/if}

    {#if (data.user.is_manager)}
        
        <Button
            buttonClasses='p-2 hover:bg-cyan-300 bg-cyan-200 cursor-pointer w-[100px] rounded-lg border border-black my-2'
            onClick={() => goto(`/hotel/${data.hotel_id}/manage/employees/${data.employee.ssn}/edit`)}
        >
            Edit
        </Button>
        {#if (!(data.user.SSN == data.employee.ssn || data.user.SSN == 100000000))}
            <Button
                buttonClasses='p-2 hover:bg-cyan-300 bg-cyan-200 cursor-pointer w-[100px] rounded-lg border border-black'
                onClick={() => goto(`/hotel/${data.hotel_id}/manage/employees/${data.employee.ssn}/fire`)}
            >
                Fire
            </Button>
        {/if}
    {/if}
</div>