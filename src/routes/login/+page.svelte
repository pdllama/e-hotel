<script lang="ts">
    import TextInput from "$lib/components/text-input.svelte";
    import Button from "$lib/components/button.svelte";

    let SSNinput = $state("")
    const changeInput = (e:HTMLInputElement) => {SSNinput = e.value}

</script>

<div class='flex flex-col justify-start items-center gap-2 w-[90%] sm:w-auto'>
    <h1 class="text-3xl font-bold mb-4">Login</h1>
    <TextInput 
        placeholder="ex. 123456789"
        label="SSN"
        numeric
        charLimit={9}
        value={SSNinput}
        nameId="SSN"
        oninput={changeInput}
        divClasses="relative"
        inputClasses="border border-black border-solid"
        labelClasses="font-bold mr-2"
        showBorder={true}
        borderColor="grey"
    />
    <Button
        buttonClasses={"bg-cyan-400 border border-black rounded p-3 my-8"}
    >
        <span class="text-xl font-bold font-mono">LOGIN</span>
    </Button>
    <p>Don't have an account? <a href="/signup" class="text-cyan-600">Sign Up</a></p>
</div>

