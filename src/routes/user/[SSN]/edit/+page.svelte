<script lang="ts">
    import { goto } from '$app/navigation';
    import Button from '$lib/components/button.svelte';
    import { stateChanges } from '../../../signup/signuplogic';
    import PersonInfoInput from '$lib/partial/signup-form/person-info-input.svelte';
    import AddressInput from '$lib/partial/signup-form/address-input.svelte';
    import { addNotification } from '$lib/notificationStore.js';


    let {data} = $props()

    let addressInit = {
        // svelte-ignore state_referenced_locally
        street: {name: data.user.street_name, number: data.user.street_number, apt_number: data.user.apt_number},
        // svelte-ignore state_referenced_locally
        postal_code: data.user.postal_code,
        // svelte-ignore state_referenced_locally
        city: data.user.city,
        // svelte-ignore state_referenced_locally
        state: data.user.state,
        // svelte-ignore state_referenced_locally
        country: data.user.country
    }
    // svelte-ignore state_referenced_locally
    let nameInit = {first_name: data.user.first_name, middle_name: data.user.middle_name, last_name: data.user.last_name}
    let form_data = $state({SSN: "", address: addressInit, name: nameInit})

    const submit = async() => {
        const editedAddress = form_data.address.street.name != data.user.street_name || 
            form_data.address.street.number != data.user.street_number || form_data.address.street.apt_number != data.user.apt_number ||
            form_data.address.postal_code != data.user.postal_code || form_data.address.city != data.user.city || form_data.address.state != data.user.state || 
            form_data.address.country != data.user.country
        const response = await fetch(`/user/${data.user.ssn}/edit`, {method: 'POST', body: JSON.stringify({...form_data, SSN: data.user.ssn, editedAddress})}).then(data => data.json())
        if (response.status == 400) {
            addNotification({body: response.error, success: false, errorStatus: 400})
        }
        else if (response.status == 201) {
            addNotification({body: 'Edited User!', success: true, errorStatus: null})
            goto(`/user/${data.user.ssn}`)
        }
    }

</script>

<div class='flex flex-col justify-start items-center gap-2 w-[100%] sm:w-auto'>
    <h1 class="text-3xl font-bold mb-4">Edit Information</h1>
    <p class="text-xl font-bold">SSN: {data.user.ssn}</p>
    <p class="text-center text-[10px]">Cannot be changed.</p>
    <PersonInfoInput
        person_state={form_data.name}
        changeName={(value:string, type:any) => form_data = stateChanges.handleNameChange(value, form_data, type)}
    />
    <AddressInput 
        addressValues={form_data.address}
        handleStreetChange={(value:string, type:any) => form_data = stateChanges.handleStreetChange(value, form_data, type)}
        handleAddressChange={(value:string, type:any) => form_data = stateChanges.handleAddressChange(value, form_data, type)}
    />
    <Button
        buttonClasses={"bg-cyan-400 border border-black mb-8 rounded p-3 sm:mt-8"}
        onClick={submit}
    >
        <span class="text-xl font-bold font-mono">Edit</span>
    </Button>
</div>