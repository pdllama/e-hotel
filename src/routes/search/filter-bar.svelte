<script lang="ts">
    import InteractableStars from "$lib/components/interactablestars.svelte";


    let {
        width='20%', height='100%'
    } = $props()

</script>

<div class={`w-[${width}] h-[${height}] flex flex-col align-center justify-start gap-3`}>
    <div class='w-[100%] h-250px'>
        <p class='text-[20px] font-bold'>Rating</p>
        <div class='flex'>
            <InteractableStars />
        </div>
    </div>
</div>