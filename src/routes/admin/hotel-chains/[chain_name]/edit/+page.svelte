<script lang="ts">
    import Button from "$lib/components/button.svelte";
    import { goto } from "$app/navigation";
    import { addNotification } from "$lib/notificationStore.js";
    import TextInput from "$lib/components/text-input.svelte";
    import AddressInput from "$lib/partial/signup-form/address-input.svelte";
    import { StreetField, AddressField } from "../../../../signup/signuplogic";
    import Clear from '$lib/assets/clear-icon.png'
    import AddSign from '$lib/assets/add-sign.png'

    let {data} = $props()

    let form = $state({
        chain_name: data.chain_name, 
        address: {
            street: {name: data.chain.street_name, number: data.chain.street_number, apt_number: data.chain.apt_number}, 
            postal_code: data.chain.postal_code, 
            city: data.chain.city, state: data.chain.state, country: data.chain.country
        },
        emails: data.chain.emails == null ? [] : [...data.chain.emails],
        phone_numbers: data.chain.phone_numbers == null ? [] : [...data.chain.phone_numbers]
    })

    const finalizeEdits = async() => {
        const missingInfo = form.address.street.name == '' || form.address.street.number == '' || form.address.postal_code == '' || form.address.country == ''
        if (missingInfo) {addNotification({body: 'Missing required address information!', success:false, errorStatus:403}); return}
        if (form.chain_name == '') {addNotification({body: 'Chain Name cannot be empty!', success:false, errorStatus:403}); return}
        const changedAddress = form.address.street.name != data.chain.street_name || form.address.street.number != data.chain.street_number || form.address.street.apt_number != data.chain.apt_number ||
            form.address.postal_code != data.chain.postal_code || form.address.city != data.chain.city || form.address.state != data.chain.state || form.address.country != data.chain.country
        const res = await fetch(`/admin/hotel-chains/${data.chain_name}/edit`, {
            method: 'PUT',
            body: JSON.stringify({old_chain_name: data.chain_name, new_chain_name: form.chain_name, changedAddress, newAddress: form.address, phone_numbers: form.phone_numbers, emails: form.emails, oldPhoneNumbers: data.chain.phone_numbers, oldEmails: data.chain.emails})
        }).then(r => r.json())

        if (res.success) {
            addNotification({body: 'Changed Hotel Chain Info!', success:true, errorStatus: 201})
            goto(`/admin/hotel-chains/${form.chain_name}`)
        } else {
            addNotification({body: res.error, success:false, errorStatus: 403})
        }
    }

</script>

<div class='flex flex-col gap-2'>
    <p class='text-[24px] font-bold'>Edit Hotel Chain Information</p>
    <TextInput
        nameId='chain_name'
        label='Chain Name: '
        placeholder={'Grand Suits'}
        divClasses="border border-black rounded-lg w-[300px]"
        labelClasses='font-bold w-[250px]'
        value={form.chain_name}
        oninput={(e:HTMLInputElement) => form.chain_name = e.value}
    />

    <p class='text-[22px] mt-5'><span class='font-bold'>Central Office Address</span></p>
    <AddressInput
        bind:addressValues={form.address}
        handleStreetChange={(value:string, type:StreetField) => {
            if (type == StreetField.number) {form.address.street.number = isNaN(parseInt(value)) ? '' : parseInt(value)}
            else if (type == StreetField.name) {form.address.street.name = value}
            else {form.address.street.apt_number =  isNaN(parseInt(value)) ? '' : parseInt(value)}
        }}
        handleAddressChange={(value:string, type:AddressField) => {
            if (type == AddressField.postal_code) {form.address.postal_code = value}
            else if (type == AddressField.city) {form.address.city = value}
            else if (type == AddressField.state) {form.address.state = value}
            else {form.address.country = value}
        }}
    />
  
    <div class='flex flex-col my-5 gap-3'>
        <p class='text-[18px]'><span class='font-bold'>Contact Phone Numbers</span></p>
        {#each form.phone_numbers as number, index}
        <div class='flex flex-row gap-2'>
            <TextInput
                nameId='number'
                placeholder={'(613) 111-1111'}
                divClasses="border border-black rounded-lg w-[300px]"
                labelClasses='font-bold w-[250px]'
                value={form.phone_numbers[index]}
                oninput={(e:HTMLInputElement) => form.phone_numbers[index] = e.value}
            />
            <Button
                buttonClasses='p-1 hover:bg-cyan-100 cursor-pointer rounded-lg'
                onClick={() => form.phone_numbers = form.phone_numbers.filter((p, i) => i != index)}
            >
                <img src={Clear} width='35px' height='35px' alt='x-sign'/>
            </Button>
        </div>
        {/each}
        <Button
            buttonClasses='w-[300px] h-[50px] p-2 hover:bg-cyan-200 cursor-pointer rounded-lg border border-black border-dashed my-2'
            onClick={() => form.phone_numbers.push('')}
        >
            <div class='size-full flex justify-center items-center'>
                <img src={AddSign} width='35px' height='35px' alt='add-sign'/>
            </div>
        </Button>
    </div>

    <div class='flex flex-col my-5 gap-3'>
        <p class='text-[18px]'><span class='font-bold'>Contact E-mails</span></p>
        {#each form.emails as number, index}
        <div class='flex flex-row gap-2'>
            <TextInput
                nameId='email'
                placeholder={'my-hotel@chain.com'}
                divClasses="border border-black rounded-lg w-[300px]"
                labelClasses='font-bold w-[250px]'
                value={form.emails[index]}
                oninput={(e:HTMLInputElement) => form.emails[index] = e.value}
            />
            <Button
                buttonClasses='p-1 hover:bg-cyan-100 cursor-pointer rounded-lg'
                onClick={() => form.emails = form.emails.filter((p, i) => i != index)}
            >
                <img src={Clear} width='35px' height='35px' alt='x-sign'/>
            </Button>
        </div>
        {/each}
        <Button
            buttonClasses='w-[300px] h-[50px] p-2 hover:bg-cyan-200 cursor-pointer rounded-lg border border-black border-dashed my-2'
            onClick={() => form.emails.push('')}
        >
            <div class='size-full flex justify-center items-center'>
                <img src={AddSign} width='35px' height='35px' alt='add-sign'/>
            </div>
        </Button>
    </div>


    <Button buttonClasses='p-2 bg-indigo-200 rounded-lg my-5 w-[150px] hover:bg-indigo-300' onClick={finalizeEdits}>Finalize Edit</Button>



</div>