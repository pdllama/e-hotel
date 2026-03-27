<script lang="ts">
    import { Rating } from "flowbite-svelte";

    let {ratingNum=1, size=35, includeBackground=true} = $props()

    // svelte-ignore state_referenced_locally
    let hoveredNum = $state(ratingNum)

    const onhoverin = (num:number) => {
        hoveredNum = num
    }

    const onhoverout = () => {
        hoveredNum = ratingNum
    }

</script>

{#if (includeBackground)}
    <div class="bg-slate-700 rounded flex">
        <Rating class="cursor-pointer" total={1} size={size} rating={hoveredNum >= 1 ? 1 : 0} onmouseenter={() => onhoverin(1)} onmouseleave={onhoverout}/>
        <Rating class="cursor-pointer" total={1} size={size} rating={hoveredNum >= 2 ? 1 : 0} onmouseenter={() => onhoverin(2)} onmouseleave={onhoverout}/>
        <Rating class="cursor-pointer" total={1} size={size} rating={hoveredNum >= 3 ? 1 : 0} onmouseenter={() => onhoverin(3)} onmouseleave={onhoverout}/>
        <Rating class="cursor-pointer" total={1} size={size} rating={hoveredNum >= 4 ? 1 : 0} onmouseenter={() => onhoverin(4)} onmouseleave={onhoverout}/>
        <Rating class="cursor-pointer" total={1} size={size} rating={hoveredNum >= 5 ? 1 : 0} onmouseenter={() => onhoverin(5)} onmouseleave={onhoverout}/>
    </div>
{:else}
    <Rating class="cursor-pointer" total={1} size={size} rating={hoveredNum >= 1 ? 1 : 0} onmouseenter={() => onhoverin(1)} onmouseleave={onhoverout}/>
    <Rating class="cursor-pointer" total={1} size={size} rating={hoveredNum >= 2 ? 1 : 0} onmouseenter={() => onhoverin(2)} onmouseleave={onhoverout}/>
    <Rating class="cursor-pointer" total={1} size={size} rating={hoveredNum >= 3 ? 1 : 0} onmouseenter={() => onhoverin(3)} onmouseleave={onhoverout}/>
    <Rating class="cursor-pointer" total={1} size={size} rating={hoveredNum >= 4 ? 1 : 0} onmouseenter={() => onhoverin(4)} onmouseleave={onhoverout}/>
    <Rating class="cursor-pointer" total={1} size={size} rating={hoveredNum >= 5 ? 1 : 0} onmouseenter={() => onhoverin(5)} onmouseleave={onhoverout}/>
{/if}

