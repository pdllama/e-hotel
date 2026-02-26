<script lang="ts">
    import TextInput from "$lib/components/text-input.svelte";
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
        oninput={(e:HTMLInputElement) => {form_data = stateChanges.handleSSNChange(e.value, form_data)}}
    />
    
</div>


