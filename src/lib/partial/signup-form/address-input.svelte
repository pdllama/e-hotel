<script lang="ts">
    import TextInput from "$lib/components/text-input.svelte";
    import {listOfCountries, getListOfStatesByCountry, getListOfCitiesByCountry} from "./address-input-constants"
    let {
        addressValues,
        handleStreetChange,
        handleAddressChange,
        handlePostalCodeChange
    } = $props()

</script>

<div class="flex flex-col justify-start items-center gap-2">
    <h2 class="">Address Information</h2>
    <div class="flex flex-col justify-start items-center gap-1">
        <div class="flex flex-row justify-start items-center gap-0.5">
            <TextInput 
                placeholder={"123"}
                label="Street #"
                value={addressValues.street.number}
                nameId="Street #"
                oninput={(e:HTMLInputElement) => {handleStreetChange(e, "number")}}
                divClasses="relative"
                labelClasses="absolute top-[100%] font-bold"
            />
            <TextInput 
                placeholder={"Main Avenue"}
                label="Street Name"
                value={addressValues.street.name}
                nameId="Street Name"
                oninput={(e:HTMLInputElement) => {handleStreetChange(e, "name")}}
                divClasses="relative"
                labelClasses="absolute top-[100%] font-bold"
            />
            
        </div>
        <div class="flex flex-row justify-start items-center gap-0.5">
            <TextInput 
                placeholder={"214"}
                label="Apt #"
                value={addressValues.street.apt_number}
                nameId="Apt #"
                oninput={(e:HTMLInputElement) => {handleStreetChange(e, "apt_number")}}
                divClasses="relative"
                labelClasses="absolute top-[100%] font-bold"
            />
            <TextInput 
                placeholder={"A1A 1A1"}
                label="Postal Code"
                value={addressValues.postal_code}
                nameId="Postal Code"
                oninput={(e:HTMLInputElement) => {handlePostalCodeChange(e)}}
                divClasses="relative"
                labelClasses="absolute top-[100%] font-bold"
            />
        </div>
        <div class="flex flex-row justify-start items-center gap-0.5">
            
        </div>
    </div>
</div>