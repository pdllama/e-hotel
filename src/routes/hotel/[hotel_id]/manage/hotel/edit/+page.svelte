<script lang="ts">
    import { goto, invalidateAll } from '$app/navigation';
    import Button from '$lib/components/button.svelte';
    import { addNotification } from '$lib/notificationStore.js';
    import AddressInput from '$lib/partial/signup-form/address-input.svelte';
    import { StreetField, AddressField } from '../../../../../signup/signuplogic.js';
    import AddSign from '$lib/assets/add-sign.png'
    import Clear from '$lib/assets/clear-icon.png'
    import TextInput from '$lib/components/text-input.svelte';

    let {data} = $props()

    const state = $state({
        address: {street: {name: data.hotel.street_name, number: data.hotel.street_number, apt_number: data.hotel.apt_number}, postal_code: data.hotel.postal_code, city: data.hotel.city, state: data.hotel.state, country: data.hotel.country},
        phone_numbers: !data.hotel.phone_numbers ? [] : [...data.hotel.phone_numbers],
        emails: !data.hotel.emails ? [] : [...data.hotel.emails]
    })

    const finalizeEdits = async() => {
        const missingInfo = state.address.street.name == '' || state.address.street.number == '' || state.address.postal_code == '' || state.address.country == ''
        if (missingInfo) {addNotification({body: 'Missing required address information!', success:false, errorStatus:403}); return}
        const changedAddress = state.address.street.name != data.hotel.street_name || state.address.street.number != data.hotel.street_number || state.address.street.apt_number != data.hotel.apt_number ||
            state.address.postal_code != data.hotel.postal_code || state.address.city != data.hotel.city || state.address.state != data.hotel.state || state.address.country != data.hotel.country
        const res = await fetch(`/hotel/${data.hotel_id}/manage/hotel/edit`, {
            method: 'PUT',
            body: JSON.stringify({hotel_id: data.hotel_id, changedAddress, newAddress: state.address, phone_numbers: state.phone_numbers, emails: state.emails, oldPhoneNumbers: data.hotel.phone_numbers, oldEmails: data.hotel.emails})
        }).then(r => r.json())

        if (res.success) {
            addNotification({body: 'Changed Hotel Info!', success:true, errorStatus: 201})
            goto(`/hotel/${data.hotel_id}/manage/hotel`)
        } else {
            addNotification({body: 'Unknown error occurred!', success:false, errorStatus: 403})
        }
    }

</script>

<div class='flex flex-col justify-start ml-3'>
    <p class='text-[24px]'><span class='font-bold'>Edit Hotel Contact Information</span></p>

    <div class='flex flex-col my-5 gap-3'>
        <p class='text-[18px]'><span class='font-bold'>Address Information</span></p>
        <AddressInput
            bind:addressValues={state.address}
            handleStreetChange={(value:string, type:StreetField) => {
                if (type == StreetField.number) {state.address.street.number = isNaN(parseInt(value)) ? '' : parseInt(value)}
                else if (type == StreetField.name) {state.address.street.name = value}
                else {state.address.street.apt_number =  isNaN(parseInt(value)) ? '' : parseInt(value)}
            }}
            handleAddressChange={(value:string, type:AddressField) => {
                if (type == AddressField.postal_code) {state.address.postal_code = value}
                else if (type == AddressField.city) {state.address.city = value}
                else if (type == AddressField.state) {state.address.state = value}
                else {state.address.country = value}
            }}
        />
    </div>


    <div class='flex flex-col my-5 gap-3'>
        <p class='text-[18px]'><span class='font-bold'>Contact Phone Numbers</span></p>
        {#each state.phone_numbers as number, index}
        <div class='flex flex-row gap-2'>
            <TextInput
                nameId='number'
                placeholder={'(613) 111-1111'}
                divClasses="border border-black rounded-lg w-[300px]"
                labelClasses='font-bold w-[250px]'
                value={state.phone_numbers[index]}
                oninput={(e:HTMLInputElement) => state.phone_numbers[index] = e.value}
            />
            <Button
                buttonClasses='p-1 hover:bg-cyan-100 cursor-pointer rounded-lg'
                onClick={() => state.phone_numbers = state.phone_numbers.filter((p, i) => i != index)}
            >
                <img src={Clear} width='35px' height='35px' alt='x-sign'/>
            </Button>
        </div>
        {/each}
        <Button
            buttonClasses='w-[300px] h-[50px] p-2 hover:bg-cyan-200 cursor-pointer rounded-lg border border-black border-dashed my-2'
            onClick={() => state.phone_numbers.push('')}
        >
            <div class='size-full flex justify-center items-center'>
                <img src={AddSign} width='35px' height='35px' alt='add-sign'/>
            </div>
        </Button>
    </div>

    <div class='flex flex-col my-5 gap-3'>
        <p class='text-[18px]'><span class='font-bold'>Contact E-mails</span></p>
        {#each state.emails as number, index}
        <div class='flex flex-row gap-2'>
            <TextInput
                nameId='email'
                placeholder={'my-hotel@chain.com'}
                divClasses="border border-black rounded-lg w-[300px]"
                labelClasses='font-bold w-[250px]'
                value={state.emails[index]}
                oninput={(e:HTMLInputElement) => state.emails[index] = e.value}
            />
            <Button
                buttonClasses='p-1 hover:bg-cyan-100 cursor-pointer rounded-lg'
                onClick={() => state.emails = state.emails.filter((p, i) => i != index)}
            >
                <img src={Clear} width='35px' height='35px' alt='x-sign'/>
            </Button>
        </div>
        {/each}
        <Button
            buttonClasses='w-[300px] h-[50px] p-2 hover:bg-cyan-200 cursor-pointer rounded-lg border border-black border-dashed my-2'
            onClick={() => state.emails.push('')}
        >
            <div class='size-full flex justify-center items-center'>
                <img src={AddSign} width='35px' height='35px' alt='add-sign'/>
            </div>
        </Button>
    </div>

   <Button
        buttonClasses='w-[150px] h-[50px] p-2 hover:bg-cyan-200 bg-cyan-100 cursor-pointer rounded-lg border border-black my-5'
        onClick={finalizeEdits}
    >
        Edit Hotel
    </Button>

</div>