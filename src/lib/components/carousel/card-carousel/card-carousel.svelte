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
        containerClasses="", cardMargin=20, //optional
        shift_duration=0.5 //optional, shift duration in seconds
    } = $props();

    // svelte-ignore state_referenced_locally
    const boxShadowExtend = type == "destination" ? 5 : 0;
    // svelte-ignore state_referenced_locally
    const cardWidth = type == "destination" ? 250 : 0;

    let outer_w = $state(-1);
    let boundaries = $state({left: 0, right: 0}) // right gets updated on mount
    // svelte-ignore state_referenced_locally
    let calculatedWidth = $state(items.length == 0 ? 0 : cardWidth*items.length + (cardMargin*(items.length-1)))

    let inner:HTMLDivElement;
    let move_timer:any;

    


    // svelte-ignore state_referenced_locally
    const styleWidth = items.length == 0 ? "100%" : `${calculatedWidth}px`

    onMount(() => {
        boundaries.right = outer_w;
    })

    function setRightState() {  
        boundaries = move_right(
            calculatedWidth, boundaries.left, boundaries.right,
            parseInt(inner.style.left), cardWidth, cardMargin, boxShadowExtend
        )
        const base_num = boundaries.right == calculatedWidth ? boundaries.left+boxShadowExtend : boundaries.left-boxShadowExtend
        inner.style.left = `${-1*(base_num)}px`;
    }
    function setLeftState() {  
        boundaries = move_left(
            calculatedWidth, boundaries.left, boundaries.right,
            parseInt(inner.style.left), cardWidth, cardMargin, boxShadowExtend
        )
        inner.style.left = `${-1*(boundaries.left-boxShadowExtend)}px`;
    }

    $effect(() => {
        const prev_window_width = boundaries.right-boundaries.left;
        const curr_window_width = outer_w;
        const difference = curr_window_width-prev_window_width
        const move_from_left = boundaries.right == calculatedWidth && difference > 0
        if (move_from_left) {
            boundaries.left = boundaries.left-(difference)
        } else {
            boundaries.right = boundaries.right+(curr_window_width-prev_window_width);
        }
        
        if (move_from_left) {
            clearTimeout(move_timer);
            move_timer = setTimeout(() => {
                inner.style.left = `${-1*(boundaries.left)-difference}px`;
            }, 500)
        }
        
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
    
    {#if (boundaries.left > 0)}
        <div class="absolute left-[0%] top-[calc(50%-16px)] z-20">
            <Button 
                buttonClasses="
                    flex justify-center items-center 
                    w-[32px] h-[32px] rounded-md black-white-invert
                    
                "
                onClick={setLeftState}
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
            transition: left ${shift_duration}s;
        `}
    >
        {#each items as item}
            <DestinationCard
                name={item.name}
                numHotels={item.numHotels}
                avgPrice={item.avgPrice}
                imgLink={item.imgLink}
            />
        {:else}
        <div class="flex size-full justify-center items-center">
            <p class="text-md text-stone-500 w-[100%] text-center italic">No destinations to show</p>
        </div>
        {/each}
    </div>
    {#if (boundaries.right < calculatedWidth)}
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


