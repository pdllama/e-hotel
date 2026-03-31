<script lang="ts">
    import Button from "../button.svelte";
    let { 
        options=[], // {label: string, value: string}[]
        buttonClasses="",
        containerClasses="",
        value=$bindable(),
        canHaveNoValue=true
    } = $props()
</script>

<div class={`flex flex-col items-center justify-center border border-gray rounded-lg cursor-pointer ${containerClasses}`}>
    {#each options as opt}
        <Button
            buttonClasses={`hover:bg-gray-800 ${value == opt.value ? 'bg-black text-white' : ''} h-[100%] ${opt.value != options[options.length-1].value ? 'border-left border-gray' : ''} ${buttonClasses}`}
            onClick={() => (canHaveNoValue && value == opt.value) ? value = '' : value = opt.value}
        >
            <p class='text-[16px] font-bold'>{opt.label}</p>
        </Button>
    {/each}
</div>

