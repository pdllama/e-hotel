<script lang="ts">
    import Button from "$lib/components/button.svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/state";

    let {children } = $props()

    // svelte-ignore state_referenced_locally
    const settingsOpts = ['hotels', 'hotel chains']

    const pathname = page.url.pathname

    // svelte-ignore state_referenced_locally
    let active_opt = $state(pathname.includes('hotels') ? 'hotels' :
        pathname.includes('hotel-chains') && 'hotel chains'
    )

</script>

<div class="lg:max-w-[1400px] md:max-w-[1000px] sm:max-w-[800px] size-full flex flex-col justify-center items-center gap-2">
    <div class="w-[100%] flex align-center justify-center gap-10">
        <div class="flex flex-col w-[100%] justify-center ">
             <p class="font-bold text-[36px]">Admin Portal</p>
        </div>
    </div>
    <div class='flex flex-col justify-center align-center size-full md:flex-row gap-2 grow'>
        <div class='flex flex-row align-center w-[100%] h-[100%] md:flex-col md:w-[20%]'>
            <div class='flex flex-row align-center w-[100%] h-full md:flex-col'>
            {#each settingsOpts as setting}
                <Button 
                    buttonClasses={`
                        w-[50%] h-[20%] flex align-center justify-center 
                        ${setting == 'hotel chains' ? 'bg-violet-300' : 'bg-blue-200'} 
                        py-[1rem] md:py-[2rem] md:w-[100%] 
                        ${setting == 'hotel chains' ? 'hover:bg-violet-400' : 'hover:bg-blue-400'} 
                        ${setting == active_opt ? 'pointer-events-none' : ''}
                    `}
                    onClick={() => {
                        active_opt = setting
                        goto(setting == 'hotel chains' ? `/admin/hotel-chains` : `/admin/hotels`)
                    }}
                >
                    <p class={`font-bold text-[20px] ${active_opt != setting ? 'opacity-50' : ''}`}>
                        {setting == 'hotels' ? "Hotels" : 
                        setting == 'hotel chains' && 'Hotel Chains' }
                    </p>
                </Button>
            {/each}
            </div>
            
        </div>
        
        <div class='flex flex-col w-[100%] md:w-[80%]'>
            {@render children()}
        </div>
    </div>
</div>