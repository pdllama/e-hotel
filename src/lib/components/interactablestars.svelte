<script lang="ts">
    import { Rating } from "flowbite-svelte";
    import Button from "./button.svelte";

    let {ratingNum=1, size=35, includeBackground=true, onClick=null} = $props()

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
        {#each [1, 2, 3, 4, 5] as starNum}
            <Button 
                onClick={() => onClick(starNum)}
                otherButtonProps={{
                    onmouseenter: () => onhoverin(starNum),
                    onmouseleave: onhoverout
                }}
            >
                <Rating 
                    class="cursor-pointer" 
                    total={1} 
                    size={size} 
                    rating={hoveredNum >= starNum ? 1 : 0} 
                    
                    
                />
            </Button>
        {/each}
    </div>
{:else}
    {#each [1, 2, 3, 4, 5] as starNum}
        <Button onClick={() => onClick(starNum)}>
            <Rating 
                class="cursor-pointer" 
                total={1} 
                size={size} 
                rating={hoveredNum >= starNum ? 1 : 0} 
                onmouseenter={() => onhoverin(starNum)} 
                onmouseleave={onhoverout}
                onclick={() => onClick(starNum)}
            />
        </Button>
    {/each}
{/if}

