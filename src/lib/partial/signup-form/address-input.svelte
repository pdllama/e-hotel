<script lang="ts">
    import Select from "$lib/components/select/select.svelte";
    import TextInput from "$lib/components/text-input.svelte";
    import { AddressField, NameField, StreetField } from "../../../routes/signup/signuplogic";
    import {listOfCountries, getListOfStatesByCountry, getListOfCitiesByCountry} from "./address-input-constants"
    let {
        addressValues=$bindable(),
        handleStreetChange,
        handleAddressChange,
        commonTextStyleProps=null
    } = $props()
    // svelte-ignore state_referenced_locally
    const commonProps = commonTextStyleProps == null ?  {
        divClasses: "relative",
        inputClasses: "border border-black border-solid",
        labelClasses: "absolute bottom-[100%] left-[20px] font-bold",
        showBorder: true,
        borderColor: "grey"
    } : commonTextStyleProps

    const stateSelectOptions = addressValues.country == "" ? [] : getListOfStatesByCountry(addressValues.country)

</script>

<div class="flex flex-col justify-start items-center gap-2">
    <h2 class="mb-8">Address Information</h2>
    <div class="flex flex-col justify-start items-center gap-6">
        <div class="flex flex-row justify-start items-center gap-0.5">
            <TextInput 
                placeholder={"123"}
                label="Street #"
                value={addressValues.street.number}
                nameId="Street #"
                oninput={(e:HTMLInputElement) => {handleStreetChange(e.value, StreetField.number)}}
                {...commonProps}
            />
            <TextInput 
                placeholder={"Main Avenue"}
                label="Street Name"
                value={addressValues.street.name}
                nameId="Street Name"
                oninput={(e:HTMLInputElement) => {handleStreetChange(e.value, StreetField.name)}}
                {...commonProps}
            />
            
        </div>
        <div class="flex flex-row justify-start items-center gap-0.5">
            <TextInput 
                placeholder={"214"}
                label="Apt #"
                value={addressValues.street.apt_number}
                nameId="Apt #"
                oninput={(e:HTMLInputElement) => {handleStreetChange(e.value, StreetField.apt_number)}}
                {...commonProps}
            />
            <TextInput 
                placeholder={"A1A 1A1"}
                label="Postal Code"
                value={addressValues.postal_code}
                nameId="Postal Code"
                oninput={(e:HTMLInputElement) => {handleAddressChange(e.value, AddressField.postal_code)}}
                {...commonProps}
            />
        </div>
        <div class="flex flex-row justify-start items-center gap-0.5">
            <Select 
                listOfOptions={listOfCountries}
                bind:selected={addressValues.country}
                changeSelected={(e:HTMLSelectElement) => {handleAddressChange(e.value, AddressField.country)}}
                name="country"
                label="Country"
                divClasses="relative"
                labelClasses="absolute bottom-[100%] left-[0%] font-bold"
            />
            <Select 
                listOfOptions={stateSelectOptions}
                disabled={stateSelectOptions.length == 0}
                selected={addressValues.state}
                changeSelected={(e:HTMLSelectElement) => {handleAddressChange(e.value, AddressField.state)}}
                name="state"
                label="State"
                divClasses="relative"
                labelClasses="absolute bottom-[100%] left-[0%] font-bold"
            />
        </div>
    </div>
</div>