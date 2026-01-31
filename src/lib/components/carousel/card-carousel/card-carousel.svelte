<script lang="ts">
    import { onMount } from 'svelte';
    import DestinationCard from "./cards/destination-card.svelte";
    import ArrowIcon from "$lib/assets/arrow.png"
    import Button from '$lib/components/button.svelte';
    // carousels can come in different types:
    //  1. destination carousel: from main page
    //  2. 
    // Carousel items need to match the format required
    // for the specific carousel.

    //type = destination, 
    const {
        items=[], type, // required props
        containerClasses="" //optional
    } = $props();

    let outer_w = $state(-1);
    let render_arrows = $state({left: false, right: false})

    let inner:HTMLDivElement;

    // svelte-ignore state_referenced_locally
    const calculatedWidth = items.length == 0 ? 0 : 250*items.length
    // svelte-ignore state_referenced_locally
    const styleWidth = items.length == 0 ? "100%" : `${calculatedWidth}px`

    onMount(() => {
        const carouselExceedsContainer = calculatedWidth > outer_w;
        if (carouselExceedsContainer) {render_arrows.right = true}
    })

    $effect(() => {
        const rightContentMissing = calculatedWidth > outer_w && inner.style.right != "0px";
        if (rightContentMissing) {render_arrows.right = true;}
        else {render_arrows.right = false;}
        const leftContentMissing = inner.style.left != "";
        if (leftContentMissing) {render_arrows.left = true;}
        else {render_arrows.left = false;}
    })

    

</script>

<style>
    .absolute-size {
        position: absolute;
        height: 100%;
    }
    .arrow-icon-invert:hover {
        filter: invert(100);
    }
</style>

<div 
    bind:clientWidth={outer_w} 
    class={`
        relative h-[350px] w-[100%] 
        py-[20px] px-[12px] 
        overflow-hidden 
        ${containerClasses}
    `}
>
    {#if (render_arrows.left)}
        <p>left version of: WE DID IT!!</p>
    {/if}
    <div 
        bind:this={inner} 
        class="
            absolute-size left-[0px] top-[0px] 
            flex justify-start items-center
        " 
        style={`width: ${styleWidth}`}
    >
        {#each items as item}
            <DestinationCard
                name={item.name}
                numHotels={item.numHotels}
                avgPrice={item.avgPrice}
                imgLink={item.imgLink ? item.imgLink : ""}
            />
        {:else}
        <div class="flex size-full justify-center items-center">
            <p class="text-md text-stone-500 w-[100%] text-center italic">No destinations to show</p>
        </div>
        {/each}
    </div>
    {#if (render_arrows.right)}
        <div class="absolute right-[0%] top-[calc(50%-16px)]">
            <Button 
                buttonClasses="
                    flex justify-center items-center 
                    w-[32px] h-[32px] rounded-md black-white-invert
                    
                "
                onClick={() => {}}
            >
                <img src={ArrowIcon} width=20 height=20 alt="arrow left"/>
            </Button>
        </div>
    {/if}
</div>


