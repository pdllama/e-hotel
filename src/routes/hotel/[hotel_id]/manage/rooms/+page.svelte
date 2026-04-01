<script lang='ts'>
    import Select from "$lib/components/select/select.svelte";
    import TextInput from "$lib/components/text-input.svelte";
    import Amenityselect from "$lib/partial/room_search/amenityselect.svelte";
    import Capacityselect from "$lib/partial/room_search/capacityselect.svelte";
    import Extensionselect from "$lib/partial/room_search/extensionselect.svelte";
    import Viewselect from "$lib/partial/room_search/viewselect.svelte";
    import { monthDays } from "../../../../../db/seeding/seedingutils.js";
    import roomIcon from '$lib/assets/room.png'
    import Button from "$lib/components/button.svelte";
    import { goto } from "$app/navigation";
    import PageBar from "../../../../search/page-bar.svelte";
    import { page } from "$app/state";

    let {
        data
    } = $props()

    // svelte-ignore state_referenced_locally
    let search_state:any = $state(data.search_state)

    let fromDayArr = $derived([...Array(search_state.from.month? monthDays[search_state.from.month-1] : 31).keys()].map(n => n+1))
    let toDayArr = $derived([...Array(search_state.to.month? monthDays[search_state.to.month] : 31).keys()].map(n => n+1))

    function parseTimestamp(timeState:{year: (number|''), month:(number|''), day:(number|'')}) {
        if (timeState.year == '' || timeState.month == '' || timeState.day == '') {return ''}
        return `${timeState.year}-${timeState.month}-${timeState.day}`
    }   

    function parseAmenities(amenities:string[]) {
        let str = ''
        for (let am of amenities) {
            str += `${am};`
        }
        return !str ? '' : str.slice(0, str.length-1)
    }

    function parsePriceRange() {
        const from = parseInt(search_state.price_range.price_from)
        const to = parseInt(search_state.price_range.price_to)
        return (!isNaN(from) && !isNaN(to) ? `${from}-${to}` : '')
    }

    function get_sq() {
        let query = ''
        const fromAvail = parseTimestamp(search_state.from)
        const toAvail = parseTimestamp(search_state.to)
        const searchAvail = !(!fromAvail || !toAvail)
        if (searchAvail) {query += `from=${fromAvail}&to=${toAvail}`}
        if (search_state.capacity) {query += `${query ? '&' : ''}capacity=${search_state.capacity}`}
        if (search_state.view) {query += `${query ? '&' : ''}view=${search_state.view}`}
        if (search_state.extension_possible) {query += `${query ? '&' : ''}ext=${search_state.extension_possible}`}
        const pr = parsePriceRange()
        if (pr) {{query += `${query ? '&' : ''}price=${pr}`}}
        const amenities = parseAmenities(search_state.amenities)
        if (amenities) {{query += `${query ? '&' : ''}amenities=${amenities}`}}

        return query ? `?${query}` : ''
    }

    function search() {
        goto(`/hotel/${data.hotel_id}/manage/rooms${get_sq()}`)
    }

    function changePage(p:number) {
        const sq = get_sq()
        if (p == 1) {goto(`/hotel/${data.hotel_id}/manage/rooms${sq != '' ? `?${sq}` : ''}`)}
        else {goto(`/hotel/${data.hotel_id}/manage/rooms?p=${p}${sq != '' ? `&${sq}` : ''}`)}
    }

</script>

<div class='flex flex-col ml-3 gap-2 mb-5'>
    {#if (data.user.is_manager)} 
    <p class='text-24px font-bold mb-3'>
        Add Rooms
    </p>
    <Button buttonClasses='p-2 bg-cyan-100 hover:bg-cyan-200 cursor-pointer border border-black rounded-lg w-[150px]' onClick={() => goto(`/hotel/${data.hotel_id}/manage/rooms/new`)}>Add New Room</Button>
    {/if}
    <p class='text-[24px] font-bold mb-3'>Search Rooms</p>

    <p class='text-[14px]'>Availability (DD:MM:YYYY)</p>
    <div class='flex flex-row gap-3'>
        <Select 
            listOfOptions={fromDayArr}
            singleValue={true}
            divClasses='gap-1 min-w-[150px]'
            labelClasses='text-nowrap min-w-[50px] font-bold'
            label='From: '
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
                if (monthDays[search_state.from.month-1] < search_state.from.day) {
                    search_state.from.day = 1
                }
            }}
        />
        <Select 
            listOfOptions={[...Array(10).keys()].map(n => n+(new Date().getFullYear()))}
            singleValue={true}
            name='Year'
            selected={search_state.from.year}
            changeSelected={(e:HTMLInputElement) => {search_state.from.year = parseInt(e.value)}}
        />
    </div>
    <div class='flex flex-row gap-3'>
        <Select 
            listOfOptions={toDayArr}
            singleValue={true}
            divClasses='gap-1 min-w-[150px]'
            labelClasses='text-nowrap min-w-[50px] font-bold'
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
            listOfOptions={[...Array(10).keys()].map(n => n+(new Date().getFullYear()))}
            singleValue={true}
            name='Year'
            selected={search_state.to.year}
            changeSelected={(e:HTMLInputElement) => {search_state.to.year = parseInt(e.value)}}
        />
    </div>
    <div class='flex flex-row gap-1'>
        <Capacityselect bind:value={search_state.capacity} selDivClasses='flex-col'/>
        <Viewselect bind:value={search_state.view} selDivClasses='flex-col'/>
        <Extensionselect bind:value={search_state.extension_possible} selDivClasses='flex-col'/>
    </div>
    <div class='flex flex-row gap-1 items-center'>
        <Amenityselect bind:value={search_state.amenities}/>
        <p class='font-bold text-[14px]'>Price Range:</p>
        <TextInput 
            placeholder={'$0'}
            nameId='price-from'
            divClasses='w-[100px] border border-black rounded-lg'
            nodivpadding
            value={search_state.price_range.price_from}
            numeric
            oninput={(e:HTMLInputElement) => search_state.price_range.price_from = e.value}
        /> 
        - 
        <TextInput 
            placeholder={'$99999'}
            nameId='price-to'
            divClasses='w-[100px] border border-black rounded-lg'
            nodivpadding
            value={search_state.price_range.price_to}
            numeric
            oninput={(e:HTMLInputElement) => search_state.price_range.price_to = e.value}
        />
    </div>
    <Button buttonClasses='p-2 bg-cyan-100 hover:bg-cyan-200 cursor-pointer border border-black rounded-lg w-[150px]' onClick={search}>Search</Button>
    <div class='flex flex-col gap-1'>
        {#each data.results as room}
            <Button 
                buttonClasses={`w-[90%] h-[50px] flex flex-row justify-start items-center gap-2 hover:bg-gray-200 cursor-pointer p-2 rounded-lg`}
                onClick={() => goto(`/hotel/${data.hotel_id}/manage/rooms/${room.room_number}`)}
            >
                <img src={roomIcon} width={'50px'} height={'50px'} alt='placeholder'/>
                <div class='flex flex-col justify-start items-start w-[100%]'>
                    <p class='text-20px font-bold'>Room {room.room_number}</p>
                    <p class='text-[14px]'>${room.price} per night</p>
                </div>
            </Button>
        {:else}
            <div class="flex flex-col size-full justify-center items-center">
                <p class='text-[12px] italic'>No results found</p>
            </div>
        {/each}
        {#if (data.results.length != 0 && data.results[0].totalcount > 15)}
        <div class='flex flex-row gap-6 items-center'>
            <PageBar 
                page={search_state.page == 0 ? 1 : search_state.page}
                numResults={parseInt(data.results[0].totalcount)}
                query=''
                queryString={page.url.search.slice(1, page.url.search.length)}
                numResultsPerPage={15}
                customChangePage={(page:number) => changePage(page)}
            />
        </div>
        {/if}
    </div>
</div>