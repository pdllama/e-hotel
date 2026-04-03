<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "$lib/components/button.svelte";
    import { employeeRoles, payStruct } from "../../../../../../static/db_enum_types.js";
    import Select from "$lib/components/select/select.svelte";
    import TextInput from "$lib/components/text-input.svelte";
    import { addNotification } from "$lib/notificationStore.js";
    import PersonInfoInput from "$lib/partial/signup-form/person-info-input.svelte";
    import { NameField } from "../../../../../signup/signuplogic.js";
    import { AddressField, StreetField } from "../../../../../signup/signuplogic.js";
    import AddressInput from "$lib/partial/signup-form/address-input.svelte";
    import { education } from "../../../../../../static/db_enum_types.js";

    let {
        data
    } = $props()

    let state:any = $state({SSN: '', checkedSSN: '', restAvailable: false})

    const check_SSN = async() => {
        if (isNaN(parseInt(state.SSN))) {addNotification({body: 'SSN must be a non-empty numeric value!', success: false, errorStatus:403})}
        else {
            const res = await fetch(`/hotel/${data.hotel_id}/manage/employees/new?SSN=${state.SSN}&hotel=${data.hotel_id}`, {method: 'GET'}).then(v => v.json())
            if (res.success) {
                const {type, person, isAlreadyEmployee} = res
                switch (type) {
                    case 'none': 
                        state = {
                            SSN: state.SSN, 
                            checkedSSN: state.SSN, 
                            restAvailable: true, 
                            name: {first_name: '', middle_name: '', last_name: ''},
                            address: {street: {number: '', name: '', apt_number: ''}, postal_code: '', city: '', state: '', country: ''},
                            education_level: '',
                            role: '',
                            pay: '',
                            pay_struct: '',
                            person
                        }
                        break;
                    case 'person': state = {
                            SSN: state.SSN, 
                            checkedSSN: state.SSN, 
                            restAvailable: true, 
                            education_level: '',
                            role: '',
                            pay: '',
                            pay_struct: '',
                            person
                        }
                        break;
                    case 'employee': state = isAlreadyEmployee ? {...state, isAlreadyEmployee, person} : {
                            SSN: state.SSN, 
                            checkedSSN: state.SSN, 
                            restAvailable: true, 
                            role: '',
                            pay: '',
                            pay_struct: '',
                            person
                    }
                    break;
                }
            } else {
                addNotification({body: 'Somethng went wrong!', success: false, errorStatus:403})
            }
        }
    }

    const finalize = async() => {
       const res = await fetch(`/hotel/${data.hotel_id}/manage/employees/new`, {
            method: 'POST',
            body: JSON.stringify({hotel_id: data.hotel_id, SSN: state.SSN, name: state.name, address: state.address, education_level: state.education_level, role: state.role, pay: state.pay, pay_struct: state.pay_struct})
       }).then(res => res.json())
       if (res.success) {
            addNotification({body: "Added the new employee!", success: true, errorStatus: 201})
            goto(`/hotel/${data.hotel_id}/manage/employees/${state.SSN}`)
       } else {
            addNotification({body: 'Something went wrong!', success:false, errorStatus: 403})
       }
    }

    const eduMapping = {
        'less_than_hs': 'Less than High School',
        'hs': 'High School',
        'undergraduate': 'Undergraduate Degree',
        'master': "Master's Degree",
        'phd': 'P.h.D.'
    }

    type eduMappingType = typeof eduMapping

    $effect(() => {
        if (state.SSN != state.checkedSSN) {
            state.restAvailable = false
        }
    })

</script>

<div class='flex flex-col justify-start ml-3'>    
    <p class='text-[24px]'><span class='font-bold'>New Employee</span></p>
    <div class='flex flex-row gap-5'>
        <TextInput
            nameId='ssn'
            label='SSN: '
            placeholder={123456789}
            numeric
            divClasses="border border-black rounded-lg w-[300px]"
            labelClasses='font-bold w-[250px]'
            value={state.SSN}
            oninput={(e:HTMLInputElement) => state.SSN = isNaN(parseInt(e.value)) ? '' : parseInt(e.value)}
        />
        <Button
            buttonClasses='p-2 hover:bg-cyan-300 bg-cyan-200 cursor-pointer w-[100px] rounded-lg border border-black my-2'
            onClick={check_SSN}
        >
            Check SSN
        </Button>
    </div>
    {#if state.isAlreadyEmployee}
        <p class='text-[18px]'>You already have this employee working for you!</p>
        <p class='text-[18px] mt-5'><span class='font-bold'>Name: </span> {state.person.first_name} {state.person.middle_name} {state.person.last_name}</p>
    {/if}
    {#if state.restAvailable}
    <p class='text-[14px]'>{!state.person ? "We couldn't find a person associated with that SSN. You will have to enter all their information." : !(state.education_level == undefined) ? "We found a person, but not an employee associated with that SSN." : "We found an employee in our system associated with that SSN."}</p>
    
    {#if state.name != undefined}
        <PersonInfoInput 
            person_state={state.name}
            changeName={(new_value:string, type:NameField) => {
                if (type == NameField.first_name) {state.name.first_name = new_value}
                else if (type == NameField.middle_name) {state.name.middle_name = new_value}
                else {state.name.last_name = new_value}
            }}
        />
        <AddressInput 
            addressValues={state.address}
            handleStreetChange={(value:string, type:StreetField) => {
                if (type == StreetField.number) {state.address.street.number = isNaN(parseInt(value)) ? '' : parseInt(value)}
                else if (type == StreetField.name) {state.address.street.name = value}
                else {state.address.street.apt_number =  isNaN(parseInt(value)) ? '' : parseInt(value)}
            }}
            handleAddressChange={(value:string, type:AddressField) => {
                if (type == AddressField.postal_code) {state.address.postal_code = value}
                else if (type == AddressField.city) {state.address.city = value}
                else if (type == AddressField.state) {state.address.state = value}
                else {state.address.country = value}
            }}
        />
    {/if}
    {#if state.person != undefined}
        <p class='text-[18px] mt-5'><span class='font-bold'>Name: </span> {state.person.first_name} {state.person.middle_name} {state.person.last_name}</p>
    {/if}
    {#if state.education_level != undefined}
        <div class='my-5'>
            <Select
                name='education_level'
                label="Education Level: "
                selected={state.education_level}
                listOfOptions={education.map(e => {return {name: eduMapping[e as keyof eduMappingType], value: e}})}
                changeSelected={(e:HTMLSelectElement) => {state.education_level = e.value}}
                divClasses='gap-1 w-[300px]'
                labelClasses='text-nowrap min-w-[150px] font-bold'
            />
        </div>
    {/if}
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
        labelClasses='text-nowrap min-w-[100px] font-bold'
    />
    <div class='flex gap-5 my-5'>
        <Button
            buttonClasses='p-2 hover:bg-cyan-300 bg-cyan-200 cursor-pointer w-[100px] rounded-lg border border-black my-2'
            onClick={finalize}
        >
            Add Employee
        </Button>
    </div>
    {/if}
</div>