<script lang="ts">
    import Button from "$lib/components/button.svelte";
    import { goto } from "$app/navigation";
    import { addNotification } from "$lib/notificationStore.js";

    let {data} = $props()

    let deleteConfirmOpen = $state(false)

    const finalizeDelete = async() => {
        const res = await fetch(`/admin/hotels/${data.hotel_id}`,
            {
                method: 'DELETE'
            }
        ).then(r => r.json())
        if (res.success) {
            addNotification({body: `Deleted the Hotel!`, success:true, errorStatus:201})
            goto(`/admin/hotels`)
        } else {
            addNotification({body: `Error occurred!`, success:false, errorStatus:400})
        }
    }

</script>

<div class='flex flex-col gap-2'>
    <p class='text-[24px] font-bold'>Hotel Information</p>
    <p class='text-[18px]'><span class='font-bold'>Hotel ID: </span> {data.hotel.address_id}</p>
    <p class='text-[18px] mt-5'><span class='font-bold'>Street: </span> {data.hotel.street_number} {data.hotel.street_name}</p>
    <p class='text-[18px]'><span class='font-bold'>Postal Code: </span> {data.hotel.postal_code}</p>
    <p class='text-[18px]'><span class='font-bold'>Location: </span> {data.hotel.city}, {data.hotel.state}, {data.hotel.country}</p>
    <div class="w-[300px] min-w-[300px] flex flex-col mt-5">
        
    </div>
    <Button buttonClasses='p-2 bg-indigo-200 rounded-lg mt-5 w-[150px] hover:bg-indigo-300' onClick={() => goto(`/hotel/${data.hotel_id}/manage`)}>Manage</Button>
    <div class='flex flex-col mt-20'>
        <Button buttonClasses='p-2 bg-red-200 hover:bg-red-300 border border-black rounded-lg w-[150px]' onClick={() => deleteConfirmOpen = true}>Delete Hotel</Button>
    </div>
    {#if deleteConfirmOpen}
    <div class='flex flex-col mt-20'>
        <p>Are you sure you want to delete this hotel?</p>
        <div class='flex gap-2 mt-2'>
            <Button buttonClasses='p-2 bg-red-200 hover:bg-red-300 border border-black rounded-lg w-[150px]' onClick={finalizeDelete}>Yes</Button>
            <Button buttonClasses='p-2 bg-blue-200 hover:bg-blue-300 border border-black rounded-lg w-[150px]' onClick={() => deleteConfirmOpen = false}>No</Button>
        </div>
    </div>
    {/if}
</div>