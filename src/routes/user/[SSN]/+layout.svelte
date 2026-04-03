<script lang="ts">
    import Button from '$lib/components/button.svelte';
    import userProfilePic from '$lib/assets/user-profile-black.png'
    import { goto } from '$app/navigation';

    let { children, data } = $props();

    // svelte-ignore state_referenced_locally
    const settingsOpts = data.user.ssn === 100000000 ? ['info', 'bookings', 'admin'] : data.user.accountType == 'customer' ? ['info', 'bookings'] :  ['info', 'bookings', 'employment']

    // svelte-ignore state_referenced_locally
    let active_opt = $state(data.pathname.includes('bookings') ? 'bookings' : (data.pathname.includes('employment') && data.user.accountType != 'customer') ? 'employment' : 'info')

</script>

<div class="lg:max-w-[1000px] md:max-w-[800px] sm:max-w-[600px] size-full flex flex-col justify-center items-center gap-2">
    <div class="w-[100%] flex align-center justify-center gap-10">
        <img src={userProfilePic} width={"200px"} height={"200px"} alt="placeholder" class="opacity-90"/>
        <div class="flex flex-col w-[100%] justify-center ">
             <p class="font-bold text-[36px]">{data.user.first_name} {data.user.middle_name} {data.user.last_name}</p>
             {#if (data.user.ssn != 100000000)}<p class="text-[24px]">{data.user.accountType[0].toUpperCase()+data.user.accountType.slice(1, data.user.accountType.length)} Account</p>
             {:else}<p class="text-[24px]">Admin Account</p>{/if}
        </div>
    </div>
    <div class='flex flex-col justify-center align-center size-full md:flex-row gap-2 grow'>
        <div class='flex flex-row align-center w-[100%] h-[100%] md:flex-col md:w-[20%]'>
            <div class='flex flex-row align-center w-[100%] h-full md:flex-col'>
            {#each settingsOpts as setting}
                <Button 
                    buttonClasses={`
                        w-[50%] h-[20%] flex align-center justify-center 
                        ${setting == 'bookings' ? 'bg-violet-300' : 'bg-blue-200'} 
                        py-[1rem] md:py-[4rem] md:w-[100%] 
                        ${setting == 'bookings' ? 'hover:bg-violet-400' : 'hover:bg-blue-400'} 
                        ${setting == active_opt ? 'pointer-events-none' : ''}
                    `}
                    onClick={() => {
                        active_opt = setting
                        goto(setting == 'info' ? `/user/${data.user.SSN}` : `/user/${data.user.SSN}/${setting}`)
                    }}
                >
                    <p class={`font-bold text-[20px] ${active_opt != setting ? 'opacity-50' : ''}`}>{setting == 'info' ? "Account Info" : setting == 'bookings' ? 'Bookings' : setting == 'admin' ? 'Admin' : 'Employment'}</p>
                </Button>
            {/each}
            </div>
            
        </div>
        
        <div class='flex flex-col w-[100%] md:w-[80%]'>
            {@render children()}
        </div>
    </div>
    
</div>