<script lang="ts">
    import TextInput from "$lib/components/text-input.svelte";
    import Select from "$lib/components/select/select.svelte";
    import Button from "$lib/components/button.svelte";
    import Tag from "$lib/components/tag.svelte";


    type NewRoomType ={number: (number|''), price: number|'', capacity: number, view: string|null, extension_possible: boolean, amenities: string[]}

    let {
        finalizeFunc,
        init={number: '', price: '', capacity: 1, view: null, extension_possible: false, amenities: []} as NewRoomType,
        update=false
    } = $props()

    
    let state:NewRoomType = $state(init)
    const amenityOptions = [
        'Air Conditioning', 'Heating', 'Wi-Fi', 'Television', 'Mini Bar', 'Refrigerator', 'Coffee Maker', 'Safe', 'Desk', 'Seating Area', 
        'Room Service', 'Hair Dryer', 'Toiletries', 'Bathrobe', 'Slippers', 'Bathtub', 'Iron', 'Closet', 'Soundproofing', 'Electric Kettle',
        'Microwave', 'Alarm Clock', 'Laptop Safe', 'Universal Power Outlets', 'Streaming Services', 'Room Lighting Control', 'Telephone with Voicemail',
        'Intercom', 'WiFi Printer', 'LED Mood Lighting', 'Charging Stations', 'Bluetooth Speaker', 'Streaming HDMI Ports', 'Welcome Snacks', 
        'Coffee & Tea Supplies', 'Complimentary Bottled Water', 'Eco-friendly Amenities', 'Baby Cot', 'Extra Bed', 'Wheelchair Accessible', 'Pet-Friendly',
        'Hypoallergenic Bedding', 'Blackout Curtains', 'Balcony'
    ]


</script>

<div class='flex flex-col gap-4 ml-4'>
    <p class='font-bold text-[24px] mb-3'>{update ? 'Update Room' : 'Create New Room'}</p>
    <TextInput
        placeholder={'e.g. 202'}
        label={'Room Number: '}
        value={state.number}
        numeric
        oninput={(e:HTMLInputElement) => {state.number = e.value == '' ? '' : parseInt(e.value)}}
        nameId="room_number"
        divClasses={'w-[400px]'}
        labelClasses={'w-[200px] font-bold'}
        nodivpadding
    />
    <TextInput
        placeholder={'e.g. $79'}
        label={'Price (per night): '}
        value={state.price}
        numeric
        oninput={(e:HTMLInputElement) => {state.price = e.value == '' ? '' : parseInt(e.value)}}
        nameId="price"
        divClasses={'w-[400px]'}
        labelClasses={'w-[200px] font-bold'}
        nodivpadding
    />
    <Select 
        name={'capacity'}
        label='Capacity: '
        labelClasses="w-[100px]"
        divClasses="w-[300px]"
        listOfOptions={['1', '2', '4']}
        singleValue
        selected={state.capacity.toString()}
        changeSelected={(e:HTMLInputElement) => {state.capacity = parseInt(e.value)}}
    />
    <Select 
        name={'view'}
        label='View: '
        labelClasses="w-[100px]"
        divClasses="w-[300px]"
        listOfOptions={[{name: 'None', value: ''}, {name: 'Mountain', value: 'mountain'}, {name: 'Sea', value: 'sea'}]}
        selected={state.view == null ? '' : state.view}
        changeSelected={(e:HTMLInputElement) => {state.view = e.value == '' ? null : e.value}}
    />
    <div class='flex flex-row gap-3 items-center'>
        <p class='text-[14px]'>Extension Possible?</p>
        <input 
            type='checkbox' 
            checked={state.extension_possible} 
            class='cursor-pointer' 
            onchange={() => state.extension_possible = !state.extension_possible}
        />
    </div>
    <div class='flex flex-col gap-3'>
        <p class='text-[14px]'>Associated Amenities:</p>
        <div class='flex flex-row w-[90%] flex-wrap'>
            {#each amenityOptions as am}
                <Button
                    buttonClasses='p-1'
                    onClick={() => {
                        if (state.amenities.includes(am)) {state.amenities = state.amenities.filter(a => a != am)}
                        else {state.amenities = [...state.amenities, am]}
                    }}
                >
                    <Tag text={am} classes='bg-green-700' overrideColor={state.amenities.includes(am)}/>
                </Button>
            {/each}
        </div>
    </div>
    <Button buttonClasses='p-2 bg-cyan-100 hover:bg-cyan-200 cursor-pointer border border-black rounded-lg w-[150px] mb-6' onClick={() => finalizeFunc(state)}>{update ? 'Update' : 'Add New'} Room</Button>
</div>