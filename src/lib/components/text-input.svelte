<script lang="ts">
    import clearIcon from "$lib/assets/clear-icon.png"
    let { 
        placeholder, value, oninput, nameId, //input props
        divClasses='', inputProps={}, inputClasses='', //customization
        icon=null, iconAlt='', iconClasses="", //optional elements
        clearHandler=null //optional elements
    } = $props();
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
            rounded-lg conditional-border
            ${inputClasses}
        `}
        {...inputProps}
    />
    {#if (clearHandler !== null)}
            <button>
                <img src={clearIcon} alt="clear input icon" class={"w-[100%]"}/>
            </button>
    {/if}
</div>