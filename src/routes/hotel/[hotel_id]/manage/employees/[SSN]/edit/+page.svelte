<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "$lib/components/button.svelte";
    import { employeeRoles, payStruct } from "../../../../../../../static/db_enum_types.js";
    import Select from "$lib/components/select/select.svelte";
    import TextInput from "$lib/components/text-input.svelte";
    import { addNotification } from "$lib/notificationStore.js";

    let {
        data
    } = $props()

    let state = $state({role: data.works_data.role, pay: data.works_data.pay, pay_struct: data.works_data.pay_struct})

    const edit = async() => {
        if (state.pay == '') {addNotification({body: 'Pay cannot be empty!', success:false, errorStatus:403})}
        else {
            const res = await fetch(`/hotel/${data.hotel_id}/manage/employees/${data.works_data.ssn}/edit`, {
                method: 'PUT',
                body: JSON.stringify({...state, SSN: data.works_data.ssn, hotel_id: data.hotel_id})
            }).then(d => d.json())
            if (res.success) {
                addNotification({body: 'Edited the employee!', success:true, errorStatus:201})
                goto(`/hotel/${data.hotel_id}/manage/employees/${data.works_data.ssn}`)
            } else {
                 addNotification({body: 'Unknown error occurred!', success:false, errorStatus:403})
            }
        }
    }

</script>

<div class='flex flex-col justify-start ml-3'>
    <Button buttonClasses='p-1 bg-indigo-200 rounded-lg mt-1 mb-3 w-[150px] hover:bg-indigo-300' onClick={() => history.back()}>Back</Button>
    
    <p class='text-[24px]'><span class='font-bold'>Employee Information</span></p>
    <p class='text-[18px] mt-5'><span class='font-bold'>Name: </span> {data.works_data.first_name} {data.works_data.middle_name} {data.works_data.last_name}</p>

    <Select
        name='role'
        label='Role: '
        selected={state.role}
        singleValue
        listOfOptions={employeeRoles}
        changeSelected={(e:HTMLSelectElement) => {state.role = e.value}}
        divClasses='gap-1 w-[300px]'
        labelClasses='text-nowrap min-w-[50px] font-bold'
    />
    <TextInput
        nameId='pay'
        label='Pay: '
        placeholder={state.pay_struct == 'hourly' ? '23' : '45000'}
        numeric
        divClasses="border border-black rounded-lg w-[300px]"
        labelClasses='font-bold w-[250px]'
        value={state.pay}
        oninput={(e:HTMLInputElement) => state.pay = isNaN(parseInt(e.value)) ? '' : parseInt(e.value)}
    />
    <Select
        name='pay_struct'
        label='Pay Structure: '
        selected={state.pay_struct}
        listOfOptions={[{name: 'Hourly', value: 'hourly'}, {name: 'Salary', value: 'salary'}]}
        changeSelected={(e:HTMLSelectElement) => {state.pay_struct = e.value}}
        divClasses='gap-1 w-[300px]'
        labelClasses='text-nowrap min-w-[50px] font-bold'
    />
    <p class='text-[18px] mt-5'><span class='font-bold'>Warning</span>: If this employee is assigned General Manager, the current one will be re-assigned to a different role!</p>
    <div class='flex gap-5 my-5'>
        <Button
            buttonClasses='p-2 hover:bg-cyan-300 bg-cyan-200 cursor-pointer w-[100px] rounded-lg border border-black my-2'
            onClick={edit}
        >
            Edit
        </Button>
        <Button
            buttonClasses='p-2 hover:bg-cyan-300 bg-cyan-200 cursor-pointer w-[100px] rounded-lg border border-black my-2'
            onClick={() => goto(`/hotel/${data.hotel_id}/manage/employees/${data.works_data.ssn}`)}
        >
            Cancel
        </Button>
    </div>
</div>