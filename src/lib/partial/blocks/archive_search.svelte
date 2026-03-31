<script lang="ts">
    import { goto } from "$app/navigation";
    import Select from "$lib/components/select/select.svelte";
    import Togglebutton from "$lib/components/togglebutton/togglebutton.svelte";
    import { monthDays } from "../../../db/seeding/seedingutils";
    import PageBar from "../../../routes/search/page-bar.svelte";
    import Archiveblock from "../ui/archiveblock.svelte";
    import { page } from "$app/state";

    let {
        data,
        gotoFunc
        // data.search_state = {
        //  status:string, 
        // from: {day, month, year (numbers)}, 
        // to: {day, month, year(numbers)}
        //  page: number
        // }
        // data.results = []
    } = $props()

    

    // svelte-ignore state_referenced_locally
    let search_state = $state(data.search_state)

    let fromDayArr = $derived([...Array(search_state.from.month? monthDays[search_state] : 31).keys()].map(n => n+1))
    let toDayArr = $derived([...Array(search_state.to.month? monthDays[search_state] : 31).keys()].map(n => n+1))

</script>

<div class='size-full flex flex-col gap-2'>
    <div class='flex flex-col gap-1'>
        <p class='text-[14px] font-bold'>Archive Type</p>
        <Togglebutton
            bind:value={search_state.status}
            options={[{label: 'Booking', value: 'booked'}, {label: 'Rental', value: 'renting'}, {label: 'Completed', value: 'completed'}, {label: 'Cancelled', value: 'cancelled'}]}
        />
    </div>
    {#if (search_state.status != 'renting')}
    <div class='flex flex-row gap-1'>
        <Select 
            listOfOptions={fromDayArr}
            singleValue={true}
            label='From (DD:MM:YYYY): '
            name='Day'
            selected={search_state.from.day}
            changeSelected={(e:HTMLInputElement) => {search_state.from.day = parseInt(e.value)}}
        />
        <Select 
            listOfOptions={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
            singleValue={true}
            name='Month'
            selected={search_state.from.month}
            changeSelected={(e:HTMLInputElement) => {
                search_state.from.month = parseInt(e.value)
                if (monthDays[search_state.from.month] < search_state.from.day) {
                    search_state.from.day = 1
                }
            }}
        />
        <Select 
            listOfOptions={[...Array(50).keys()].map(n => n+2000)}
            singleValue={true}
            name='Year'
            selected={search_state.from.year}
            changeSelected={(e:HTMLInputElement) => {search_state.from.year = parseInt(e.value)}}
        />
        <Select 
            listOfOptions={toDayArr}
            singleValue={true}
            label='To: '
            name='Day'
            selected={search_state.to.day}
            changeSelected={(e:HTMLInputElement) => {search_state.to.day = parseInt(e.value)}}
        />
        <Select 
            listOfOptions={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
            singleValue={true}
            name='Month'
            selected={search_state.to.month}
            changeSelected={(e:HTMLInputElement) => {
                search_state.to.month = parseInt(e.value)
                if (monthDays[search_state.to.month] < search_state.to.day) {
                    search_state.to.day = 1
                }
            }}
        />
        <Select 
            listOfOptions={[...Array(50).keys()].map(n => n+2000)}
            singleValue={true}
            name='Year'
            selected={search_state.to.year}
            changeSelected={(e:HTMLInputElement) => {search_state.to.year = parseInt(e.value)}}
        />
    </div>
    {/if}
    <div class='flex flex-col size-full gap-2'>
        <p class='font-bold text-[20px]'>Results</p>
        <div class='flex flex-col size-full gap-1'>
            {#if (data.results[0] != undefined)}
            <p class='text-[11px] italic'>{data.results[0].totalCount} results found</p>
            {/if}
            {#each data.results as result}
                <Archiveblock 
                    status={result.status}
                    archive_data={result}
                    onClick={() => goto(gotoFunc(result.archive_id))}
                />
            {:else}
            <div class="flex flex-col size-full justify-center items-center">
                <p class='text-[12px] italic'>No results found</p>
            </div>
            {/each}
            <PageBar 
                page={search_state.page}
                numResults={data.results[0] == undefined ? 0 : data.results[0].totalCount}
                query=''
                queryString={page.url.search.slice(1, page.url.search.length)}
            />
        </div>
    </div>
</div>