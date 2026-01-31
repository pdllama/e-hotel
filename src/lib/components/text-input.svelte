<script lang="ts">
    import clearIcon from "$lib/assets/clear-icon.png"
    import forwardTarget from "$lib/util/forwardtarget";
    import Button from "./button.svelte";
    let { 
        placeholder, value, oninput, nameId, //input props
        divClasses='', inputProps={}, inputClasses='', //customization
        icon=null, iconAlt='', iconClasses="", //optional elements
        clearHandler=null, submitHandler=null, //optional elements
        submitText="", submitButtonClasses="", submitTextClasses="" //optional elements
    } = $props();

    const removePlaceholder = (e: HTMLInputElement) => {e.placeholder = "";}
    const replacePlaceholder = (e: HTMLInputElement) => {e.placeholder = placeholder}
</script>

<style>
    .shadow {
        box-shadow: 0px 0px 40px white;
    }
    .conditional-border {
        border: 1px solid white;
        border-radius: 8px;
    }
    .conditional-border:focus {
        border: 1px solid oklch(0.546 0.245 262.881);
        border-radius: 8px;
    }
    
</style>

<div class={`flex justify-center items-center p-1 shadow ${divClasses}`}>
    {#if (icon !== null)}
        <img alt={iconAlt} src={icon} width="30px" height="30px" class={`p-1 mx-1 ${iconClasses}`}/>
    {/if}
    <input 
        type="text"
        id={nameId}
        name={nameId}
        {placeholder}
        {value}
        {oninput}
        class={`
            w-[100%] 
            h-[100%] 
            rounded-lg conditional-border font-bold
            ${inputClasses}
        `}
        {...inputProps}
        onfocus={(e) => forwardTarget(e, removePlaceholder)}
        onfocusout={(e) => forwardTarget(e, replacePlaceholder)}
    />
    {#if (clearHandler !== null)}
            <Button
                onClick={clearHandler}
                buttonClasses="min-w-[40px] min-h-[40px] w-[24px] h-[24px] mr-1 ml-1.5 p-2 rounded-lg grey-hover"
            >
                <img src={clearIcon} alt="clear input icon" class={"w-[100%] h-[100%]"}/>
            </Button>
    {/if}
    {#if (submitHandler !== null)}
            <Button
                onClick={submitHandler}
                buttonClasses={`min-w-[70px] mr-1 p-2 rounded-lg blue ${submitButtonClasses}`}
            >
                <span class={submitTextClasses}>{submitText}</span>
            </Button>
    {/if}
</div>