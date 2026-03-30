<script lang="ts">
    import Select from "$lib/components/select/select.svelte";
    import TextInput from "$lib/components/text-input.svelte";
    import { AddressField, NameField, StreetField } from "../../../routes/signup/signuplogic";
    import {listOfCountries, countryNameToIsoCodeMap, getListOfStatesByCountry, getListOfCitiesByCountry} from "./../../../static/address_inputs.ts"

    let {
        addressValues=$bindable(),
        handleStreetChange,
        handleAddressChange,
        commonTextStyleProps={
            divClasses: "relative w-[100%] sm:w-auto",
            inputClasses: "border border-black border-solid sm:w-auto",
            labelClasses: "absolute bottom-[100%] left-[20px] font-bold",
            showBorder: true,
            borderColor: "grey"
        }
    } = $props()

    // To-do : make the derivation of the below two more responsive.
    //          See slowdown when selecting France as the country

    let stateSelectOptions = $derived.by(() => addressValues.country == "" ? [] : getListOfStatesByCountry(countryNameToIsoCodeMap[addressValues.country]))
    let citySelectOptions = $derived.by(() => addressValues.country == "" ? [] : getListOfCitiesByCountry(countryNameToIsoCodeMap[addressValues.country]))

    

</script>

<div class="flex flex-col justify-start items-center gap-2 w-[100%]">
    <h2 class="text-2xl font-bold mb-8">Address Information</h2>
    <div class="flex flex-col justify-start items-center gap-6 w-[100%]">
        <div class="flex flex-col sm:flex-row justify-start items-center gap-6 sm:gap-0.5 w-[90%] sm:w-auto">
            <TextInput 
                placeholder={"123"}
                numeric
                charLimit={6}
                label="Street #"
                value={addressValues.street.number}
                nameId="Street #"
                oninput={(e:HTMLInputElement) => {handleStreetChange(e.value, StreetField.number)}}
                {...commonTextStyleProps}
            />
            <TextInput 
                placeholder={"Main Avenue"}
                charLimit={40}
                label="Street Name"
                value={addressValues.street.name}
                nameId="Street Name"
                oninput={(e:HTMLInputElement) => {handleStreetChange(e.value, StreetField.name)}}
                {...commonTextStyleProps}
            />
            
        </div>
        <div class="flex flex-col sm:flex-row justify-start items-center gap-6 sm:gap-0.5 w-[90%] sm:w-auto">
            <TextInput 
                placeholder={"214"}
                label="Apt #"
                numeric
                charLimit={10}
                value={addressValues.street.apt_number}
                nameId="Apt #"
                oninput={(e:HTMLInputElement) => {handleStreetChange(e.value, StreetField.apt_number)}}
                {...commonTextStyleProps}
            />
            <TextInput 
                placeholder={"A1A 1A1"}
                charLimit=15
                label="Postal/Zip Code"
                value={addressValues.postal_code}
                nameId="Postal Code"
                oninput={(e:HTMLInputElement) => {handleAddressChange(e.value, AddressField.postal_code)}}
                {...commonTextStyleProps}
            />
        </div>
        <div class="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-2 size-full">
            <Select 
                listOfOptions={listOfCountries}
                selected={addressValues.country}
                changeSelected={(e:HTMLSelectElement) => {handleAddressChange(e.value, AddressField.country)}}
                name="country"
                label="Country"
                divClasses="relative w-[90%] sm:w-[30%]"
                labelClasses="absolute bottom-[100%] left-[0%] font-bold"
            />
            <Select 
                listOfOptions={stateSelectOptions}
                disabled={stateSelectOptions.length == 0}
                selected={addressValues.state}
                changeSelected={(e:HTMLSelectElement) => {handleAddressChange(e.value, AddressField.state)}}
                name="state"
                label="State"
                divClasses="relative w-[90%] sm:w-[25%]"
                labelClasses="absolute bottom-[100%] left-[0%] font-bold"
            />
            <Select 
                listOfOptions={citySelectOptions}
                disabled={citySelectOptions.length == 0}
                selected={addressValues.city}
                changeSelected={(e:HTMLSelectElement) => {handleAddressChange(e.value, AddressField.city)}}
                name="city"
                label="City"
                divClasses="relative w-[90%] sm:w-[25%] sm:mb-0 mb-10"
                labelClasses="absolute bottom-[100%] left-[0%] font-bold"
            />
        </div>
    </div>
</div>