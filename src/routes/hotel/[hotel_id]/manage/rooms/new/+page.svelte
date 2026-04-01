<script lang="ts">
    import { addNotification } from "$lib/notificationStore.js";
    import Newroomform from "$lib/partial/blocks/newroomform.svelte";
    import { goto } from "$app/navigation";
    let {data} = $props()


    const finalize = async(formData:any) => {
        if (typeof formData.number != 'number' || typeof formData.price != 'number') {
            addNotification({body: "Room Number/price isn't filled in!", success:false, errorStatus:401})
        } else {
            const res = await fetch(`/hotel/${data.hotel_id}/manage/rooms/new`, {method: 'POST', body: JSON.stringify({...formData, hotel_id: data.hotel_id})}).then(data => data.json())
            if (res.success) {
                addNotification({body: 'Added the room!', success: true, errorStatus: 201})
                goto(`/hotel/${data.hotel_id}/manage/rooms/${formData.number}`)
            } else {
                addNotification({body: 'Error entering the room', success: false, errorStatus: 403})
            }
        }
    }

</script>

<Newroomform 
    finalizeFunc={finalize}
/>