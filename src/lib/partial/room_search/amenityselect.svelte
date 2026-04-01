<script lang="ts">
    import Modal from "$lib/components/modal.svelte";
    import Button from "$lib/components/button.svelte";

    let {
        value=$bindable([])
    } = $props()

    let modal_open = $state(false)

    const amenityOptions = [
        'Air Conditioning', 'Heating', 'Wi-Fi', 'Television', 'Mini Bar', 'Refrigerator', 'Coffee Maker', 'Safe', 'Desk', 'Seating Area', 
        'Room Service', 'Hair Dryer', 'Toiletries', 'Bathrobe', 'Slippers', 'Bathtub', 'Iron', 'Closet', 'Soundproofing', 'Electric Kettle',
        'Microwave', 'Alarm Clock', 'Laptop Safe', 'Universal Power Outlets', 'Streaming Services', 'Room Lighting Control', 'Telephone with Voicemail',
        'Intercom', 'WiFi Printer', 'LED Mood Lighting', 'Charging Stations', 'Bluetooth Speaker', 'Streaming HDMI Ports', 'Welcome Snacks', 
        'Coffee & Tea Supplies', 'Complimentary Bottled Water', 'Eco-friendly Amenities', 'Baby Cot', 'Extra Bed', 'Wheelchair Accessible', 'Pet-Friendly',
        'Hypoallergenic Bedding', 'Blackout Curtains', 'Balcony'
    ]

    const addOrRemoveAmenity = (am:string) => {
        if (value.includes(am)) {value = value.filter(a => a != am)}
        else {value = [...value, am]}
    }
</script>

<Button buttonClasses='p-2 bg-cyan-100 hover:bg-cyan-200 cursor-pointer border border-black rounded-lg' onClick={() => modal_open = true}>Set Amenities</Button>
<Modal open={modal_open} onclose={() => {!modal_open}} height='75%'>
    <p class='text-[32px] text-white font-bold mb-4'>All Amenities</p>
    <div class='flex flex-row justify-center size-full'>
        <div class='flex flex-col w-[50%]'>
            {#each amenityOptions.slice(0, amenityOptions.length/2) as am}
                <div class='flex gap-1 justify-start align-center'>
                    <input 
                        type='checkbox' 
                        checked={value.includes(am)} 
                        class='cursor-pointer' 
                        onchange={() => addOrRemoveAmenity(am)}
                    />
                    <p class='font-bold text-[16px] text-white'>{am}</p>
                </div>
            {/each}
        </div>
        <div class='flex flex-col w-[50%] gap-0.5'>
            {#each amenityOptions.slice(amenityOptions.length/2, amenityOptions.length) as am}
                <div class='flex gap-1 justify-start align-center'>
                    <input 
                        type='checkbox' 
                        checked={value.includes(am)} 
                        class='cursor-pointer' 
                        onchange={() => addOrRemoveAmenity(am)}
                    />
                    <p class='font-bold text-[16px] text-white'>{am}</p>
                </div>
            {/each}
        </div>
    </div>
    <div class='flex items-center justify-center gap-5'>
        <Button buttonClasses='bg-white p-2 rounded rounded-lg' onClick={() => modal_open = false}>CLOSE</Button>
        <Button buttonClasses='bg-white p-2 rounded rounded-lg' onClick={() => {value = []}}>RESET FILTERS</Button>
    </div>
</Modal>