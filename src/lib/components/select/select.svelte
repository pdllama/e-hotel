<script lang="ts">
    import forwardTarget from "$lib/util/forwardtarget";
    let {
        listOfOptions, selected, changeSelected,
        name,
        divClasses="", label="", labelClasses="" //optional
    } = $props()
</script>

<div class={`flex justify-center items-center p-1 shadow ${divClasses}`}>
{#if label !== ""}
    <label for={name} class={labelClasses}>{label}</label>
{/if}
<select
    name={name}
    bind:value={selected}
    onchange={(e:Event) => {forwardTarget(e, changeSelected)}}
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