<script lang="ts">
    import forwardTarget from "$lib/util/forwardtarget";
    let {
        listOfOptions, selected=$bindable(), changeSelected,
        name,
        divClasses="", label="", labelClasses="", //optional
        disabled=false,//optional
        singleValue=false, //If options come in a diff format
    } = $props()

</script>

<div class={`flex justify-center items-center p-1 shadow ${divClasses}`}>
{#if label !== ""}
    <label for={name} class={`${labelClasses} ${disabled ? "opacity-50 pointer-events-none" : ""}`}>{label}</label>
{/if}
<select
    name={name}
    bind:value={selected}
    onchange={(e:Event) => {forwardTarget(e, changeSelected)}}
    class={disabled ? `opacity-50 pointer-events-none w-[100%]` : "w-[100%]"}
    disabled={disabled}
>
    {#each listOfOptions as option}
        <option 
            value={singleValue ? option : option.value}
        >
            {singleValue ? option : option.name}
        </option>
    {/each}
</select>
</div>