<script lang="ts">
    import Button from '$lib/components/button.svelte';
    import placeholder from '$lib/assets/placeholder.png'
    import { goto } from '$app/navigation';

    let { children, data } = $props();

    // svelte-ignore state_referenced_locally
    const settingsOpts = data.manageData.is_manager ? ['dashboard', 'rooms', 'archives', 'problems', 'employees', 'hotel'] : ['dashboard', 'rooms', 'archives', 'problems', 'employees']

    // svelte-ignore state_referenced_locally
    let active_opt = $state(data.pathname.includes('rooms') ? 'rooms' :
        data.pathname.includes('archives') ? 'archives' :
        data.pathname.includes('problems') ? 'problems' :
        data.pathname.includes('employees') ? 'employees' :
        (data.pathname.slice(6, data.pathname.length).includes('hotel') && data.manageData.is_manager) ? 'hotel' : 'dashboard'
    )

</script>

<div class="lg:max-w-[1000px] md:max-w-[800px] sm:max-w-[600px] size-full flex flex-col justify-center items-center gap-2">
    <div class="w-[100%] flex align-center justify-center gap-10">
        <img src={placeholder} width={"200px"} height={"200px"} alt="placeholder" class="opacity-90"/>
        <div class="flex flex-col w-[100%] justify-center ">
             <p class="font-bold text-[36px]">{data.manageData.chain_name}</p>
             <p class="text-[18px]">{data.manageData.street_number} {data.manageData.street_name} {data.manageData.postal_code}</p>
             <p class="text-[18px]">{data.manageData.city}, {data.manageData.state}, {data.manageData.country}</p>
             <p class="text-[24px] font-bold">Management Portal</p>
        </div>
    </div>
    <div class='flex flex-col justify-center align-center size-full md:flex-row gap-2 grow'>
        <div class='flex flex-row align-center w-[100%] h-[100%] md:flex-col md:w-[20%]'>
            <div class='flex flex-row align-center w-[100%] h-full md:flex-col'>
            {#each settingsOpts as setting}
                <Button 
                    buttonClasses={`
                        w-[50%] h-[20%] flex align-center justify-center 
                        ${setting == 'rooms'|| setting == 'problems' || setting == 'hotel' ? 'bg-violet-300' : 'bg-blue-200'} 
                        py-[1rem] md:py-[2rem] md:w-[100%] 
                        ${setting == 'rooms'|| setting == 'problems' || setting == 'hotel' ? 'hover:bg-violet-400' : 'hover:bg-blue-400'} 
                        ${setting == active_opt ? 'pointer-events-none' : ''}
                    `}
                    onClick={() => {
                        active_opt = setting
                        goto(setting == 'dashboard' ? `/hotel/${data.manageData.address_id}/manage` : `/hotel/${data.manageData.address_id}/manage/${setting}`)
                    }}
                >
                    <p class={`font-bold text-[20px] ${active_opt != setting ? 'opacity-50' : ''}`}>
                        {setting == 'dashboard' ? "Dashboard" : 
                        setting == 'rooms' ? 'Rooms' : 
                        setting == 'archives' ? 'Archives' :
                        setting == 'problems' ? 'Problems' :
                        setting == 'employees' ? 'Employees' : 'Hotel'}
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