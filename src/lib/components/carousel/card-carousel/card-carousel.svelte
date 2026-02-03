<script lang="ts">
    import { onMount } from 'svelte';
    import DestinationCard from "./cards/destination-card.svelte";
    import ArrowIcon from "$lib/assets/arrow.png"
    import Button from '$lib/components/button.svelte';
    import { move_left, move_right } from '../card-carousel-logic';
    // carousels can come in different types:
    //  1. destination carousel: from main page
    //  2. 
    // Carousel items need to match the format required
    // for the specific carousel.

    //type = destination, 
    const {
        items=[], type, // required props
        containerClasses="", cardMargin=20 //optional
    } = $props();

    // svelte-ignore state_referenced_locally
    const boxShadowExtend = type == "destination" ? 5 : 0;
    // svelte-ignore state_referenced_locally
    const cardWidth = type == "destination" ? 250 : 0;

    let outer_w = $state(-1);
    let boundaries = $state({left: 0, right: 0, keyframe: ""}) // right gets updated on mount
    let render_arrows = $state({left: false, right: false})
    // svelte-ignore state_referenced_locally
    let calculatedWidth = $state(items.length == 0 ? 0 : cardWidth*items.length + (cardMargin*(items.length-1)))


    let inner:HTMLDivElement;

    


    // svelte-ignore state_referenced_locally
    const styleWidth = items.length == 0 ? "100%" : `${calculatedWidth}px`

    onMount(() => {
        const carouselExceedsContainer = calculatedWidth > outer_w;
        if (carouselExceedsContainer) {render_arrows.right = true}
        boundaries.right = outer_w;
    })

    function setRightState() {
        inner.classList.remove("start-animation");
        boundaries = move_right(
            calculatedWidth, boundaries.left, boundaries.right,
            parseInt(inner.style.left), cardWidth, cardMargin, boxShadowExtend
        )
        inner.classList.add("start-animation");
    }
    function setLeftState(value:boolean) {render_arrows.left = value;}

    $effect(() => {
        
        const rightContentMissing = calculatedWidth > outer_w && inner.style.right != `${boxShadowExtend}px`;
        if (rightContentMissing) {render_arrows.right = true;}
        else {render_arrows.right = false;}
        const leftContentMissing = inner.style.left != `${boxShadowExtend}px`;
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
{@html `<style>${boundaries.keyframe}</style>`}
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
        <div class="absolute left-[0%] top-[calc(50%-16px)] z-20">
            <Button 
                buttonClasses="
                    flex justify-center items-center 
                    w-[32px] h-[32px] rounded-md black-white-invert
                    
                "
                onClick={() => {}}
            >
                <img src={ArrowIcon} width=20 height=20 alt="arrow left" class="rotate-180"/>
            </Button>
        </div>
    {/if}
    <div 
        bind:this={inner} 
        class="
            absolute-size top-[0px] 
            flex justify-start items-center
        "
        style={`
            width: ${styleWidth}; 
            gap: ${cardMargin}px; 
            left: ${boxShadowExtend}px;
        `}
    >
        {#each items as item}
            <DestinationCard
                name={item.name}
                numHotels={item.numHotels}
                avgPrice={item.avgPrice}
            />
        {:else}
        <div class="flex size-full justify-center items-center">
            <p class="text-md text-stone-500 w-[100%] text-center italic">No destinations to show</p>
        </div>
        {/each}
    </div>
    {#if (render_arrows.right)}
        <div class="absolute right-[0%] top-[calc(50%-16px)] z-20">
            <Button 
                buttonClasses="
                    flex justify-center items-center 
                    w-[32px] h-[32px] rounded-md black-white-invert
                    
                "
                onClick={setRightState}
            >
                <img src={ArrowIcon} width=20 height=20 alt="arrow right"/>
            </Button>
        </div>
    {/if}
</div>


