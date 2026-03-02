<script lang="ts">
    import TextInput from "$lib/components/text-input.svelte";
    import AddressInput from "$lib/partial/signup-form/address-input.svelte";
    import forwardTarget from "$lib/util/forwardtarget";
    import { stateChanges } from "./signuplogic";

    let addressInit = {
        street: {name: "", number: "", apt_number: ""},
        postal_code: "",
        city: "",
        state: "",
        country: ""
    }
    let nameInit = {first_name: "", middle_name: "", last_name: ""}
    let form_data = $state({SSN: "", address: addressInit, name: nameInit})

    $effect(() => {
        console.log("UPDATED")
    })

    // $inspect(form_data.address.country)
</script>
<div class='flex flex-col justify-start items-center gap-2'>
    <h1>Sign up</h1>
    <TextInput 
        placeholder="ex. 123456789"
        label="SSN"
        value={form_data.SSN}
        nameId="SSN"
        oninput={(e:HTMLInputElement) => stateChanges.handleSSNChange(e.value, form_data)}
        divClasses="relative"
        inputClasses="border border-black border-solid"
        labelClasses="font-bold mr-2"
        showBorder={true}
        borderColor="grey"
    />
    <AddressInput 
        bind:addressValues={form_data.address}
        handleStreetChange={(value:string, type:any) => stateChanges.handleStreetChange(value, form_data, type)}
        handleAddressChange={(value:string, type:any) => form_data = stateChanges.handleAddressChange(value, form_data, type)}
    />
</div>


