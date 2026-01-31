<script lang="ts">
    const {
        name, numHotels, avgPrice, imgLink="", imgAlt=name,
        onClick=null
    } = $props();

    let text:HTMLDivElement;
    let image:HTMLDivElement;
    // svelte-ignore state_referenced_locally
    const conditionalBg = imgLink == "" ? "bg-stone-300" : ""

    function cardOnHover() {
        //produces events for the text and for the image
        image.classList.add("zoom-in-event");
        text.classList.add("bg-stone-200");
    }
    function cardOnHoverOut() {
        image.classList.add("zoom-out-event");
        text.classList.remove("bg-stone-200");
    }

    

</script>
<style>
    .shadow {
        box-shadow: 0px 5px 5px -1px rgb(60, 60, 60);
    }
    @keyframes zoom-in {
        0% {zoom: 100%;}
        100% {zoom: 125%;}
    }
    @keyframes zoom-out {
         0% {zoom: 125%;}
        100% {zoom: 100%;}
    }

    .zoom-in-event {
        animation: zoom-in 1.5s ease-out forwards;
    }
    .zoom-out-event {
        animation: zoom-out 1.5s ease-out;
    }
    
</style>

<div 
    onmouseenter={cardOnHover}
    aria-hidden={false}
    onmouseleave={cardOnHoverOut}
    class="
        w-[250px] h-[90%] min-w-[250px]
        flex flex-col justify-start align-center
        shadow rounded-2xl mx-[10px] hover:cursor-pointer
    "
>
    <div 
        bind:this={image}
        class={`w-[100%] h-[70%] rounded-t-2xl flex justify-center items-center ${conditionalBg}`}
    >
        {#if (imgLink != "")}
            <img src={imgLink} alt={imgAlt}/>
        {:else}
            <p class="text-sm text-stone-500 text-center italic">Image Unavailable</p>
        {/if}
    </div>
    <div 
        bind:this={text}
        
        class="w-[90%] h-[30%] rounded-2xl flex flex-col justify-center items-start m-3 p-2"
    >
        <p class="text-xl color-black font-bold mb-1">{name}</p>
        <p class="text-sm color-black"><span class="font-bold text-md">{numHotels}</span> Hotels</p>
        <p class="text-sm color-black"><span class="font-bold text-md">${avgPrice}</span> Avg.</p>
    </div>
</div>