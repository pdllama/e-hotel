<script lang='ts'>
    import TextInput from "$lib/components/text-input.svelte";
    import searchIcon from '$lib/assets/search-icon.png'
    import placeholder from '$lib/assets/placeholder.png'
    import PageBar from "../../search/page-bar.svelte";
    import { goto } from "$app/navigation";
    import Button from "$lib/components/button.svelte";
    import { page } from "$app/state";
    import { beforeNavigate, afterNavigate } from "$app/navigation";

    let {data} = $props()

    let search_state = $state(data.search_state)
    let scrollPositions = new Map<string, number>();

    beforeNavigate((nav) => {
        scrollPositions.set(nav.from?.url.pathname || '', window.scrollY);
    });

    // Restore scroll position after navigation
    afterNavigate((nav) => {
        const pos = scrollPositions.get(nav.to?.url.pathname || '0');
        if (pos !== undefined) {
            window.scrollTo(0, pos);
        }
    });
</script>

<div class='flex flex-col gap-5'>
<Button buttonClasses='p-2 bg-cyan-100 hover:bg-cyan-200 cursor-pointer border border-black rounded-lg w-[200px]' onClick={() => goto(`/admin/hotel-chains/new`)}>Add New Hotel Chain</Button>
    <p class='text-[24px] font-bold'>Hotel Chains</p>
    <div class='border border-black w-[90%] max-w-[800px] rounded-lg'>
        <TextInput 
            placeholder="Search Cities, Hotels, etc."
            nameId="country"
            divClasses="w-[100%] h-[50px] bg-white rounded-lg z-5"
            value={search_state.query}
            oninput={(e:HTMLInputElement) => {
                search_state.query = e.value
            }}
            icon={searchIcon}
            iconAlt="search icon"
            clearHandler={() => search_state.query = ''}
            submitHandler={() => {
                goto(`/admin/hotel-chains${search_state.query ? `?q=${search_state.query}` : ''}`)}
            }
            submitText="SEARCH"
        />
    </div>
    <p class='text-[18px] font-bold'>Chain Results</p>
    <div class='flex flex-col gap-2'>
        {#if (data.chains[0] != undefined)}<p class='text-[12px] italic text-gray'>{data.chains[0].totalcount} results found</p>{/if}
        {#each data.chains as chain}
            <Button
                buttonClasses={`w-[100%] h-[50px] flex flex-row justify-start items-center gap-2 hover:bg-gray-200 cursor-pointer p-2 rounded-lg`}
                onClick={() => goto(`/admin/hotel-chains/${chain.chain_name}`)}
            >
                <img src={placeholder} width={'50px'} height={'50px'} alt='placeholder'/>
                <div class='flex flex-col justify-start items-start w-[100%]'>
                    <p class='text-[24px] font-bold'>{chain.chain_name}</p>
                </div>
            </Button>
        {:else}
            <p class='w-[100%] text-center italic text-gray text-[14px]'>No results found</p>
        {/each}
        {#if (data.chains.length != 0 && data.chains[0].totalcount > 10)}
            <div class='flex flex-row gap-6 items-center'>
                <PageBar 
                    page={search_state.page == 0 ? 1 : search_state.page}
                    numResults={parseInt(data.chains[0].totalcount)}
                    query=''
                    queryString={page.url.search.slice(1, page.url.search.length)}
                    numResultsPerPage={10}
                    customChangePage={(newP:number) => {
                        goto(`/admin/hotel-chains${(search_state.query || newP != 1) ? '?' : ''}${newP != 1 ?`p=${newP}` : ''}${search_state.query ? `${newP != 1 ? '&' : ''}q=${search_state.query}` : ''}`)
                    }}
                />
            </div>
        {/if}
    </div>

</div>