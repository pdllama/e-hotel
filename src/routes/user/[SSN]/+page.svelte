<script lang="ts">
    import { goto } from '$app/navigation';
    import Button from '$lib/components/button.svelte';


    let {data} = $props()

</script>

<div class='flex flex-col justify-start ml-3'>
    <p class='text-[18px]'><span class='font-bold'>SSN: </span> ********************{data.user.ssn.toString()[data.user.ssn.toString().length-1]}</p>
    <p class='text-[18px] mt-5'><span class='font-bold'>First Name: </span> {data.user.first_name}</p>
    <p class='text-[18px]'><span class='font-bold'>Middle Name: </span> {data.user.middle_name}</p>
    <p class='text-[18px]'><span class='font-bold'>Last Name: </span> {data.user.last_name}</p>
    <p class='text-[18px] mt-5'><span class='font-bold'>Street: </span> {data.user.street_number} {data.user.street_name} {data.user.apt_number ? `Apt ${data.user.apt_number}` : ''}</p>
    <p class='text-[18px]'><span class='font-bold'>Postal Code: </span> {data.user.postal_code}</p>
    <p class='text-[18px]'><span class='font-bold'>Location: </span> {data.user.city}, {data.user.state}, {data.user.country}</p>
    <Button buttonClasses='p-2 bg-indigo-200 rounded-lg mt-5 w-[150px] hover:bg-indigo-300' onClick={() => goto(`/user/${data.user.ssn}/edit`)}>Edit Information</Button>
</div>