<script lang="ts">
    import forwardTarget from "$lib/util/forwardtarget";
    let {
        listOfOptions, selected=$bindable(), changeSelected,
        name,
        divClasses="", label="", labelClasses="", //optional
        disabled=false //optional
    } = $props()

    // svelte-ignore state_referenced_locally
    const disabledClasses = disabled ? "opacity-50 pointer-events-none" : ""
</script>

<div class={`flex justify-center items-center p-1 shadow ${divClasses}`}>
{#if label !== ""}
    <label for={name} class={`${labelClasses} ${disabledClasses}`}>{label}</label>
{/if}
<select
    name={name}
    bind:value={selected}
    onchange={(e:Event) => {forwardTarget(e, changeSelected)}}
    class={disabledClasses}
>
    {#each listOfOptions as option}
        <option 
            value={option.value}
        >
            {option.name}
        </option>
    {/each}
</select>
</div>