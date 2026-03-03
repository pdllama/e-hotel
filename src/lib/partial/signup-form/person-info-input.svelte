<script lang="ts">
    import TextInput from "$lib/components/text-input.svelte";
    import { NameField } from "../../../routes/signup/signuplogic";
    let {
        person_state, 
        changeName,
        commonTextStyleProps={
            inputClasses: "border border-black border-solid",
            labelClasses: "absolute bottom-[100%] left-[20px] font-bold",
            showBorder: true,
            borderColor: "grey"
        }
    } = $props()

    const mQ = `@media only screen and (max-width: 600px) {
        
    }`

</script>

<div class="flex flex-col justify-start items-center gap-2 w-[90%] sm:w-auto">
    <h2 class="text-2xl font-bold mb-8">Personal Information</h2>
    <div class="flex flex-col justify-start items-center gap-6 w-[100%] sm:w-auto">
        <div class="flex flex-col justify-center items-center gap-6 sm:flex-row sm:gap-0.5 w-[100%] sm:w-auto">
            <TextInput 
                placeholder={"John"}
                label="First Name"
                charLimit={30}
                value={person_state.first_name}
                nameId="First Name"
                oninput={(e:HTMLInputElement) => {changeName(e.value, NameField.first_name)}}
                divClasses="relative w-[100%] sm:w-[30%]"
                {...commonTextStyleProps}
            />
            <TextInput 
                placeholder={"David"}
                label="Middle Name"
                charLimit={30}
                value={person_state.middle_name}
                nameId="Middle Name"
                oninput={(e:HTMLInputElement) => {changeName(e.value, NameField.middle_name)}}
                divClasses="relative w-[100%] sm:w-[25%]"
                {...commonTextStyleProps}
            />
            <TextInput 
                placeholder={"Smith"}
                label="Last Name"
                charLimit={30}
                value={person_state.last_name}
                nameId="Last Name"
                oninput={(e:HTMLInputElement) => {changeName(e.value, NameField.last_name)}}
                divClasses="relative w-[100%] sm:w-[30%]"
                {...commonTextStyleProps}
            />
        </div>
    </div>
</div>
