<script lang="ts">
    const {
        name, numHotels, avgPrice, imgLink="", imgAlt=name,
        onClick=null
    } = $props();

    let text:HTMLDivElement;
    // svelte-ignore non_reactive_update
    let image:HTMLImageElement;
    let imgDarken:HTMLDivElement;
    // svelte-ignore state_referenced_locally
    const conditionalBg = imgLink == "" ? "bg-stone-300" : ""

    function cardOnHover() {
        //produces events for the text and for the image
        if (image != undefined) {
            image.classList.remove("zoom-out-event");
            image.classList.add("zoom-in-event");
        }
        text.classList.add("bg-stone-200");
        imgDarken.classList.add("opacity-20");
    }
    function cardOnHoverOut() {
        if (image != undefined) {
            image.classList.remove("zoom-in-event");
            image.classList.add("zoom-out-event");
        }
        text.classList.remove("bg-stone-200");
        imgDarken.classList.remove("opacity-20");
    }

</script>
<style>
    .shadow {
        box-shadow: 0px 5px 5px -1px rgb(60, 60, 60);
    }
    @keyframes zoom-in {
        0% {scale: 100%;}
        100% {scale: 120% 120%;}
    }
    @keyframes zoom-out {
         0% {scale: 120% 120%;}
        100% {scale: 100%;}
    }

    .zoom-in-event {
        animation: zoom-in 0.5s ease-out forwards;
    }
    .zoom-out-event {
        animation: zoom-out 0.5s ease-out forwards;
    }
    
</style>

<div 
    onmouseenter={cardOnHover}
    aria-hidden={false}
    onmouseleave={cardOnHoverOut}
    class="
        w-[250px] h-[90%] min-w-[250px]
        flex flex-col justify-start align-center
        shadow rounded-2xl hover:cursor-pointer
        overflow-hidden
    "
>
    <div 
        class={`w-[100%] h-[70%] rounded-t-2xl flex justify-center items-center overflow-hidden relative ${conditionalBg}`}
    >
        <div bind:this={imgDarken} class="z-5 size-full rounded-t-2xl bg-black opacity-0 absolute"></div>
        {#if (imgLink != "")}
            <img bind:this={image} src={imgLink} alt={imgAlt} class="bg-cover rounded-t-2xl h-[100%] w-[100%] scale-100"/>
        {:else}
            <p class="text-sm text-stone-500 text-center italic">Image Unavailable</p>
        {/if}
    </div>
    <div 
        bind:this={text}
        
        class="w-[97%] h-[30%] rounded-2xl flex flex-col justify-center items-start m-1 p-4"
    >
        <p class="text-xl color-black font-bold mb-1">{name}</p>
        <p class="text-sm color-black"><span class="font-bold text-md">{numHotels}</span> Hotels</p>
        <p class="text-sm color-black"><span class="font-bold text-md">${avgPrice}</span> Avg.</p>
    </div>
</div>