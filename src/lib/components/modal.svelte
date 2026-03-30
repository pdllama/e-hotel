<script lang="ts">

    let {
        children,
        open=false,
        onclose=()=>{},
        height='80%'
    } = $props()


</script>

<style>
    .transition-visible {
        transition: visibility;
    }
    .background-color {
        background-color: rgba(0, 0, 0, 0.5);
    }
    .inner-bg {
        background-color: rgb(34, 47, 88);
    }
</style>

<dialog class={`${open ? 'visible' : 'invisible'} flex items-center justify-center size-full fixed inset-0 background-color z-[50] transition-visible`} onclick={(e:any) => onclose()}>
    <div 
        class={`lg:w-[50%] md:w-[80%] sm:w-[90%] w-[100%]] min-w-[300px] h-[${height}] inner-bg rounded rounded-lg flex flex-col gap-2 opacity-100 z-[55] p-5`} 
        onclick={(e:MouseEvent) => {e.stopPropagation()}}
    >
        {@render children()}
    </div>
</dialog>