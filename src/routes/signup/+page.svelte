<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "$lib/components/button.svelte";
    import TextInput from "$lib/components/text-input.svelte";
    import { addNotification } from "$lib/notificationStore";
    import AddressInput from "$lib/partial/signup-form/address-input.svelte";
    import PersonInfoInput from "$lib/partial/signup-form/person-info-input.svelte";
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

    const submit = async() => {
        const response = await fetch(`/signup`, {method: 'POST', body: JSON.stringify(form_data)}).then(data => data.json())
        if (response.status == 400) {
            addNotification({body: response.error, success: false, errorStatus: 400})
        }
        else if (response.status == 201) {
            addNotification({body: 'Created User!', success: true, errorStatus: null})
            goto('/login')
        }
    }

</script>
<div class='flex flex-col justify-start items-center gap-2 w-[90%] sm:w-auto'>
    <h1 class="text-3xl font-bold mb-4">Sign up</h1>
    <TextInput 
        placeholder="ex. 123456789"
        label="SSN"
        numeric
        charLimit={9}
        value={form_data.SSN}
        nameId="SSN"
        oninput={(e:HTMLInputElement) => form_data = stateChanges.handleSSNChange(e.value, form_data)}
        divClasses="relative"
        inputClasses="border border-black border-solid"
        labelClasses="font-bold mr-2"
        showBorder={true}
        borderColor="grey"
    />
    <p class="text-center text-[10px]">This will be used to identify you and to login. Please don't put your real SSN.</p>
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
        <span class="text-xl font-bold font-mono">SIGN UP</span>
    </Button>
</div>


