<script lang='ts'>
    import Button from "$lib/components/button.svelte";
    import { goto } from "$app/navigation";
    import { addNotification } from "$lib/notificationStore";

    let {data} = $props()

    const finalizeDelete = async() => {
        const res = await fetch(`/hotel/${data.hotel_id}/manage/employees/${data.person_data.ssn}/fire`,
            {
                method: 'DELETE'
            }
        ).then(r => r.json())
        if (res.success) {
            addNotification({body: `Fired ${data.person_data.first_name} ${data.person_data.middle_name} ${data.person_data.last_name}`, success:true, errorStatus:201})
            goto(`/hotel/${data.hotel_id}/manage/employees`)
        } else {
            addNotification({body: `Error occurred!`, success:false, errorStatus:400})
        }
    }


</script>

<div class='flex flex-col ml-3 gap-2'>
    <p class='text-[24px] font-bold'>Are you sure you want to fire {data.person_data.first_name} {data.person_data.middle_name} {data.person_data.last_name}?</p>
    <div class='flex flex-row gap-2'>
        <Button 
            buttonClasses='hover:bg-cyan-300 bg-cyan-100 p-1 rounded-lg border border-black' 
            onClick={finalizeDelete}
        >
            Fire Employee
        </Button>
        <Button 
            buttonClasses='hover:bg-cyan-300 bg-cyan-100 p-1 rounded-lg border border-black' 
            onClick={() => goto(`/hotel/${data.hotel_id}/manage/employees/${data.person_data.ssn}`)}
        >
            Cancel
        </Button>
    </div>
</div>