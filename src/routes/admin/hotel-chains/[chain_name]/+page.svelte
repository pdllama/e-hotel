<script lang="ts">
    import Button from "$lib/components/button.svelte";
    import { goto } from "$app/navigation";
    import { addNotification } from "$lib/notificationStore.js";

    let {data} = $props()

    let deleteConfirmOpen = $state(false)

    const finalizeDelete = async() => {
        const res = await fetch(`/admin/hotel-chains/${data.chain_name}`,
            {
                method: 'DELETE'
            }
        ).then(r => r.json())
        if (res.success) {
            addNotification({body: `Deleted the Hotel Chain!`, success:true, errorStatus:201})
            goto(`/admin/hotel-chains`)
        } else {
            addNotification({body: `Error occurred!`, success:false, errorStatus:400})
        }
    }

</script>

<div class='flex flex-col gap-2'>
    <p class='text-[24px] font-bold'>Hotel Chain Information</p>
    <p class='text-[18px]'><span class='font-bold'>Chain Name: </span> {data.chain_name}</p>
    <p class='text-[22px] mt-5'><span class='font-bold'>Central Office Address</span></p>
    <p class='text-[18px]'><span class='font-bold'>Street: </span> {data.chain.street_number} {data.chain.street_name}</p>
    <p class='text-[18px]'><span class='font-bold'>Postal Code: </span> {data.chain.postal_code}</p>
    <p class='text-[18px]'><span class='font-bold'>Location: </span> {data.chain.city}, {data.chain.state}, {data.chain.country}</p>
    <div class="w-[300px] min-w-[300px] flex flex-col mt-5">
        {#if (data.chain.emails != null)}
            <div class="w-[100%] flex">
                <p class='text-[12px] min-w-[93px] w-[35%] text-end'>Contact E-mail(s): </p>
                <p class='text-[12px] w-[65%] text-end'>{data.chain.emails[0]}</p>
            </div>
            {#each (data.chain.emails.length < 1 ? [] : data.chain.emails.slice(1, data.chain.emails.length)) as extra_email}
                <p class='text-[12px] text-end'>{extra_email}</p>
            {/each}
        {:else}
            <p class='text-[12px] italic'>No contact e-mails</p>
        {/if}
        {#if (data.chain.phone_numbers != null)}
            <div class="w-[100%] flex">
                <p class='text-[12px] min-w-[103px] w-[35%] text-end'>Contact Number(s): </p>
                <p class='text-[12px] w-[65%] text-end'>{data.chain.phone_numbers[0]}</p>
            </div>
            {#each (data.chain.phone_numbers.length < 1 ? [] : data.chain.phone_numbers.slice(1, data.chain.phone_numbers.length)) as extra_number}
                <p class='text-[12px] text-end'>{extra_number}</p>
            {/each}
        {:else}
            <p class='text-[12px] italic'>No contact phone numbers</p>
        {/if}
    </div>
    <Button buttonClasses='p-2 bg-indigo-200 rounded-lg mt-5 w-[150px] hover:bg-indigo-300' onClick={() => goto(`/admin/hotel-chains/${data.chain_name}/edit`)}>Edit</Button>
    <div class='flex flex-col mt-20'>
        <Button buttonClasses='p-2 bg-red-200 hover:bg-red-300 border border-black rounded-lg w-[150px]' onClick={() => deleteConfirmOpen = true}>Delete Chain</Button>
    </div>

    {#if deleteConfirmOpen}
    <div class='flex flex-col mt-20'>
        <p>Are you sure you want to delete this hotel chain?</p>
        <div class='flex gap-2 mt-2'>
            <Button buttonClasses='p-2 bg-red-200 hover:bg-red-300 border border-black rounded-lg w-[150px]' onClick={finalizeDelete}>Yes</Button>
            <Button buttonClasses='p-2 bg-blue-200 hover:bg-blue-300 border border-black rounded-lg w-[150px]' onClick={() => deleteConfirmOpen = false}>No</Button>
        </div>
    </div>
    {/if}
</div>