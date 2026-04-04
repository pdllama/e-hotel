<script lang="ts">
    import Button from "$lib/components/button.svelte";
    import TextInput from "$lib/components/text-input.svelte";
    import AddressInput from "$lib/partial/signup-form/address-input.svelte";
    import { StreetField, AddressField } from "../../../signup/signuplogic";
    import { addNotification } from "$lib/notificationStore";
    import { goto } from "$app/navigation";

    let form:any = $state({chain_name: '', address: {
            street: {name: '', number: '', apt_number: ''},
            postal_code: '',
            city: '',
            state: '',
            country: ''
        }
    })

    const finalizeEdits = async() => {
        const missingInfo = form.address.street.name == '' || form.address.street.number == '' || form.address.postal_code == '' || form.address.country == ''
        if (missingInfo) {addNotification({body: 'Missing required address information!', success:false, errorStatus:403}); return}
        if (form.chain_name == '') {addNotification({body: 'Chain Name cannot be empty!', success:false, errorStatus:403}); return}
        const res = await fetch(`/admin/hotel-chains/new`, {
            method: 'POST',
            body: JSON.stringify({chain_name: form.chain_name, address: form.address})
        }).then(r => r.json())

        if (res.success) {
            addNotification({body: 'Created the Hotel Chain!', success:true, errorStatus: 201})
            goto(`/admin/hotel-chains/${form.chain_name}`)
        } else {
            addNotification({body: res.error, success:false, errorStatus: 403})
        }
    }

</script>


<div class='flex flex-col gap-2'>
    <p class='text-[24px] font-bold'>New Hotel</p>
    <TextInput
        nameId='chain_name'
        label='Chain Name: '
        placeholder={'Grand Suites'}
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
    <Button buttonClasses='p-2 bg-indigo-200 rounded-lg mt-5 w-[200px] hover:bg-indigo-300' onClick={finalizeEdits}>Create Hotel Chain</Button>
</div>