<script lang="ts">
    import { monthDays } from "../../../../db/seeding/seedingutils";
    import roomIcon from '$lib/assets/room.png'
    import Select from "$lib/components/select/select.svelte";
    import { addNotification } from "$lib/notificationStore.js";
    import { isAfter } from "date-fns";
    import Button from "$lib/components/button.svelte";
    import TextInput from "$lib/components/text-input.svelte";
    import Capacityselect from "$lib/partial/room_search/capacityselect.svelte";
    import Viewselect from "$lib/partial/room_search/viewselect.svelte";
    import Extensionselect from "$lib/partial/room_search/extensionselect.svelte";
    import Amenityselect from "$lib/partial/room_search/amenityselect.svelte";
    import { getNumDays } from "$lib/partial/ui/parse_date.js";
    import PageBar from "../../../search/page-bar.svelte";
    import Tag from "$lib/components/tag.svelte";
    import { goto } from "$app/navigation";

    let {
        data
    } = $props()

    let form:any = $state({
        from: {year: '', month: '', day: ''}, to: {year: '', month: '', day: ''},
        prevFrom: {year: '', month: '', day: ''}, prevTo: {year: '', month: '', day: ''},
        restAvailable: false,
        validRooms: [],
        filteredRooms: [],
        search_state: {capacity: '', view: '', price: {min: '', max: ''}, extension_possible: '', amenities: [], page: 1},
        selectedRoom: ''
    })

    let selectedRoomData = $derived(form.selectedRoom === '' ? {} : form.validRooms.filter((vr:any) => vr.room_number == form.selectedRoom)[0])

    let fromDayArr = $derived([...Array(form.from.month? monthDays[form.from.month-1] : 31).keys()].map(n => n+1))
    let toDayArr = $derived([...Array(form.to.month? monthDays[form.to.month] : 31).keys()].map(n => n+1))

    $effect(() => {
        const diffDates = form.from.year != form.prevFrom.year || form.from.month != form.prevFrom.month || form.from.day != form.prevFrom.day ||
            form.to.year != form.prevTo.year || form.to.month != form.prevTo.month || form.to.day != form.prevTo.day
        if (diffDates) {
            form.restAvailable = false
        }
    })

    function parseTimestamp(timeState:{year: (number|''), month:(number|''), day:(number|'')}) {
        if (timeState.year == '' || timeState.month == '' || timeState.day == '') {return ''}
        return `${timeState.year}-${timeState.month}-${timeState.day}`
    }   

    function filterRooms() {
        form.filteredRooms = form.validRooms.filter((r:any) => {
            let allowed = true
            if (form.search_state.capacity) {if (r.capacity != form.search_state.capacity) {allowed = false}}
            if (form.search_state.view) {if (form.search_state.view == 'none' && r.view != null || form.search_state.view != 'none' && r.view != form.search_state.view) {allowed = false}}
            if (form.search_state.price.min != '' || form.search_state.price.max != '') {
                if ((form.search_state.price.min != '' && r.price < form.search_state.price.min) || (form.search_state.price.max && r.price > form.search_state.price.max)) {
                    allowed = false
                }
            }
            if (form.search_state.extension_possible) {if ((form.search_state.extension_possible == 'true' && !r.extension_possible) || (form.search_state.extension_possible == 'false' && r.extension_possible)) {allowed = false}}
            if (form.search_state.amenities.length != 0) {
                for (let am of form.search_state.amenities) {
                    if (!r.amenities.includes(am)) {allowed = false; break;}
                }
            }
            return allowed
        })
    }

    const check_availability = async() => {
        const fromTime = parseTimestamp(form.from);
        const toTime = parseTimestamp(form.to)
        if (fromTime == '' || toTime == '') {addNotification({body: 'Dates must be filled out!', success: false, errorStatus: 403}); return;}
        if (isAfter(fromTime, toTime)) {addNotification({body: 'The "to" date cannot be before the "from" date!', success: false, errorStatus: 403}); return;}
        if (isAfter(new Date().toISOString(), fromTime)) {addNotification({body: 'The "from" date must be after today!', success: false, errorStatus: 403}); return;} 
        const res = await fetch(`/hotel/${data.hotel_id}/book?from=${fromTime}&to=${toTime}&hotel=${data.hotel_id}`, {method: 'GET'}).then(r => r.json())
        if (res.success) {
            const {rooms} = res
            form.validRooms = rooms
            form.filteredRooms= rooms
            form.restAvailable = true
            form.prevFrom = {year: form.from.year, month: form.from.month, day: form.from.day}
            form.prevTo = {year: form.to.year, month: form.to.month, day: form.to.day}
            form.selectedRoom = ''
        } else {
            addNotification({body: 'Unknown error occurred!', success:false, errorStatus: 403})
        }
    }

    const book_room = async() => {
        const from = parseTimestamp(form.from)
        const to = parseTimestamp(form.to)
        const room_number = form.selectedRoom

        const res = await fetch(`/hotel/${data.hotel_id}/book`, {
            method: 'POST',
            body: JSON.stringify({hotel: data.hotel_id, room_number, from, to})
        }).then(r => r.json())
        if (res.success) {
            addNotification({body: 'Successfully created the booking!', success:true, errorStatus:201})
            goto(`/user/${data.user.ssn}/bookings/${res.archive_id}`)
        } else {
            addNotification({body: 'An unknown error occurred', success:false, errorStatus: 403})
        }
    }

    const monthOpts = [{name: '', value: ''}, 
        {name: 'January', value: 1}, {name: 'February', value: 2}, {name: 'March', value: 3},
        {name: 'April', value: 4}, {name: 'May', value: 5}, {name: 'June', value: 6},
        {name: 'July', value: 7}, {name: 'August', value: 8}, {name: 'September', value: 9},
        {name: 'October', value: 10}, {name: 'November', value: 11}, {name: 'December', value: 12}
    ]

    const num_rooms_per_page = 10

</script>

<div class='flex flex-col ml-3 gap-2 mb-5 items-center w-[90%]'>
    <p class='text-[24px] font-bold mb-3'>
        Book Room in {data.hotel.chain_name}
    </p>
   
    <div class='flex flex-col gap-3'>
        <p class='font-bold text-[18px]'>When are you booking for?</p>
        <div class='flex flex-row gap-3'>
        <Select 
            listOfOptions={fromDayArr}
            singleValue={true}
            divClasses='gap-1 min-w-[150px]'
            labelClasses='text-nowrap min-w-[50px] font-bold'
            label='From: '
            name='Day'
            selected={form.from.day}
            changeSelected={(e:HTMLInputElement) => {form.from.day = e.value == '' ? '' : parseInt(e.value)}}
        />
        <Select 
            listOfOptions={monthOpts}
            name='Month'
            selected={form.from.month}
            changeSelected={(e:HTMLInputElement) => {
                form.from.month = e.value == '' ? '' : parseInt(e.value)
                if (e.value != '' && monthDays[form.from.month] < form.from.day) {
                    form.from.day = 1
                }
            }}
        />
        <Select 
            listOfOptions={[...Array(10).keys()].map(n => n+(new Date().getFullYear()))}
            singleValue={true}
            name='Year'
            selected={form.from.year}
            changeSelected={(e:HTMLInputElement) => {form.from.year = e.value == '' ? '' : parseInt(e.value)}}
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
                selected={form.to.day}
                changeSelected={(e:HTMLInputElement) => {form.to.day = e.value == '' ? '' : parseInt(e.value)}}
            />
            <Select 
                listOfOptions={monthOpts}
                name='Month'
                selected={form.to.month}
                changeSelected={(e:HTMLInputElement) => {
                    form.to.month = e.value == '' ? '' : parseInt(e.value)
                    if (e.value != '' && monthDays[form.to.month] < form.to.day) {
                        form.to.day = 1
                    }
                }}
            />
            <Select 
                listOfOptions={[...Array(10).keys()].map(n => n+(new Date().getFullYear()))}
                singleValue={true}
                name='Year'
                selected={form.to.year}
                changeSelected={(e:HTMLInputElement) => {form.to.year = parseInt(e.value)}}
            />
        </div>
        <Button
            buttonClasses='p-2 hover:bg-cyan-300 bg-cyan-200 cursor-pointer w-[150px] rounded-lg border border-black'
            onClick={check_availability}
        >
            Check Availability
        </Button>
    </div>
    {#if (form.restAvailable)}
    <div class='flex flex-row gap-3'>
        {#if form.validRooms.length != 0}
        <p class='text-[16px]'>We found <span class='font-bold'>{form.validRooms.length}</span> rooms that are available during this time</p>
        {:else}
        <p class='text-[16px]'>We couldn't found any rooms that are available during this time! Try changing your search dates.</p>
        {/if}
    </div>
    {/if}
    {#if (form.restAvailable && form.validRooms.length != 0)}
    <div class='flex flex-row w-[80%] gap-4'>
        <div class='flex flex-col w-[40%] gap-5'>
            <p class='font-bold text-[14px]'>Price Range:</p>
            <div class='flex flex-row items-center gap-2'>
            <TextInput 
                placeholder={'$0'}
                nameId='price-from'
                divClasses='w-[200px] border border-black rounded-lg'
                nodivpadding
                value={form.search_state.price.min}
                numeric
                oninput={(e:HTMLInputElement) => form.search_state.price.min = e.value == '' ? '' : parseInt(e.value)}
            /> 
            - 
            <TextInput 
                placeholder={'$99999'}
                nameId='price-to'
                divClasses='w-[200px] border border-black rounded-lg'
                nodivpadding
                value={form.search_state.price.max}
                numeric
                oninput={(e:HTMLInputElement) => form.search_state.price.max = e.value == '' ? '' : parseInt(e.value)}
            />
            </div>
            <Capacityselect bind:value={form.search_state.capacity} selDivClasses='flex-col'/>
            <Viewselect bind:value={form.search_state.view} selDivClasses='flex-col'/>
            <Extensionselect bind:value={form.search_state.extension_possible} selDivClasses='flex-col'/>
            <Amenityselect bind:value={form.search_state.amenities}/>
            <Button
                buttonClasses='p-2 hover:bg-cyan-300 bg-cyan-200 cursor-pointer w-[150px] rounded-lg border border-black'
                onClick={filterRooms}
            >
                Apply Filters
            </Button>
            <Button
                buttonClasses='p-2 hover:bg-cyan-300 bg-cyan-200 cursor-pointer w-[150px] rounded-lg border border-black'
                onClick={() => {form.filteredRooms = form.validRooms; form.search_state = {capacity: '', view: '', price: {min: '', max: ''}, extension_possible: '', amenities: [], page: 1}}}
            >
                Reset Filters
            </Button>
        </div>
        <div class='flex flex-col w-[60%] gap-5'>
        {#each form.filteredRooms.slice((form.search_state.page-1)*num_rooms_per_page, ((form.search_state.page-1)*num_rooms_per_page)+num_rooms_per_page) as room}
            <Button 
                buttonClasses={`w-[90%] h-[100px] flex flex-row justify-start items-center gap-2 hover:bg-gray-200 cursor-pointer p-2 rounded-lg ${room.room_number == form.selectedRoom ? 'bg-gray-400' : ''}`}
                onClick={() => form.selectedRoom = room.room_number == form.selectedRoom ? '' : room.room_number}
            >
                <img src={roomIcon} width={'80px'} height={'80px'} alt='placeholder'/>
                <div class='flex flex-col justify-start items-start w-[100%]'>
                    <p class='text-20px font-bold'>Room {room.room_number}</p>
                    <p class='text-[14px]'>${room.price} per night - <span class='font-bold'>${getNumDays(parseTimestamp(form.from), parseTimestamp(form.to))*room.price}</span> Total</p>
                    <p class='text-[14px]'>{room.capacity} Bed {room.extension_possible ? 'with Extensions' : ''}, {room.view ? `${room.view[0]}${room.view.slice(1, room.view.length)} View` : 'No View'}</p>
                    <p class='text-14px'>
                        {#if room.amenities}
                            {#each room.amenities.slice(0, 3) as am}
                                 <Tag text={am}/>
                            {/each}
                            {#if room.amenities.length > 3}
                                ...
                            {/if}
                        {:else}
                            No amenities
                        {/if}
                    </p>
                </div>
            </Button>
        {:else}
            <div class="flex flex-col size-full justify-center items-center">
                <p class='text-[12px] italic'>No results found</p>
            </div>
        {/each}
        {#if (form.filteredRooms.length != 0 && form.filteredRooms.length > num_rooms_per_page)}
        <div class='flex flex-row gap-6 items-center'>
            <PageBar 
                page={form.search_state.page}
                numResults={form.filteredRooms.length}
                query=''
                queryString={''}
                numResultsPerPage={num_rooms_per_page}
                customChangePage={(page:number) => form.search_state.page = page}
            />
        </div>
        {/if}
        </div>
    </div>
    {#if form.selectedRoom}
        <div class='flex flex-col w-[80%] gap-4'>
            <p class='text-[18px] mt-1'><span class='font-bold'>Room Number: </span> {form.selectedRoom}</p>
            <p class='text-[18px]'><span class='font-bold'>Price per night: </span> ${selectedRoomData.price} per night</p>
            <p class='text-[18px]'><span class='font-bold'>Capacity: </span> {selectedRoomData.capacity} Bed</p>
            {#if (selectedRoomData.view)}<p class='text-[18px]'><span class='font-bold'>View: </span> {selectedRoomData.view[0].toUpperCase()+selectedRoomData.view.slice(1, selectedRoomData.view.length)}</p>{/if}
            <p class='text-[18px]'><span class='font-bold'>Extension Possible: </span> {selectedRoomData.extension_possible ? 'Yes' : 'No'}</p>
            <div class='flex flex-row items-center gap-2 w-[90%]'>
                <p class='text-[18px]'><span class='font-bold'>Amenities: </span></p>
                <p>
                    {#each (selectedRoomData.amenities) as amenity}
                        <Tag text={amenity} classes='text-wrap'/>
                    {:else}
                        None
                    {/each}
                </p>
            </div>
        </div>
    {/if}
    <Button
        buttonClasses={`p-2 hover:bg-cyan-300 bg-cyan-200 cursor-pointer w-[150px] rounded-lg border border-black ${!form.selectedRoom ? 'pointer-events-none opacity-50' : ''}`}
        onClick={book_room}
    >
        Book Room
    </Button>
    {/if}
</div>