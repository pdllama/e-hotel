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

</script>
<div class='flex flex-col justify-start items-center gap-2'>
    <h1>Sign up</h1>
    <TextInput 
        placeholder="ex. 123456789"
        label="SSN"
        value={form_data.SSN}
        nameId="SSN"
        oninput={(e:Event) => forwardTarget(e, stateChanges.handleSSNChange)}
        divClasses="relative"
        inputClasses="border border-black border-solid"
        labelClasses="font-bold mr-2"
        showBorder={true}
        borderColor="grey"
    />
    <AddressInput 
        addressValues={form_data.address}
        bind:fullFormData={form_data}
        handleStreetChange={(e:Event) => forwardTarget(e, stateChanges.handleStreetChange)}
        handleAddressChange={(e:Event) => forwardTarget(e, stateChanges.handleAddressChange)}
    />
</div>


