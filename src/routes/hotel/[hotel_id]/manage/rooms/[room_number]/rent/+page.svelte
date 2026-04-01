<script lang='ts'>
    import TextInput from "$lib/components/text-input.svelte";
    import Togglebutton from "$lib/components/togglebutton/togglebutton.svelte";
    import { monthDays } from "../../../../../../../db/seeding/seedingutils";
    import Select from "$lib/components/select/select.svelte";
    import PersonInfoInput from "$lib/partial/signup-form/person-info-input.svelte";
    import AddressInput from "$lib/partial/signup-form/address-input.svelte";
    import Button from "$lib/components/button.svelte";
    import { stateChanges } from "../../../../../../signup/signuplogic";
    import { convertDateToDBFormat, getTodayDBFormat, parse_date, parseYear } from "$lib/partial/ui/parse_date";
    import { addNotification } from "$lib/notificationStore";
    import { goto } from "$app/navigation";

    let {
        data
    } = $props()

    let addressInit = {
        street: {name: '', number: '', apt_number:''},
        postal_code: '',
        city: '',
        state: '',
        country: ''
    }

    let form = $state({SSN: '', name: {first_name: '', middle_name: '', last_name: ''}, address: addressInit, stay_end_date: {year: 0, month: 0, day: 0} })
    let exNew = $state('existing')

    let toDayArr = $derived([...Array(form.stay_end_date.month? monthDays[form.stay_end_date.month]: 31).keys()].map(i => i+1))


    const submit = async() => {
        const formattedD = convertDateToDBFormat(form.stay_end_date, true)
        if (!formattedD) {
            addNotification({body: 'Must have a valid end date after today!', success:false, errorStatus:403})
            return
        }
        const res = await fetch(`rent`, {
            method: 'POST', 
            body: JSON.stringify({...form, createNewCustomer: exNew == 'new', stay_start_date: getTodayDBFormat(), stay_end_date: formattedD, hotel_id: data.hotel_id, room_number: data.room_number})
        }).then(r => r.json())
        if (res.success) {
            addNotification({body: 'Rented the room!', success:true, errorStatus:201})
            goto(`/hotel/${data.hotel_id}/manage/rooms/${data.room_number}`)
        } else {
            addNotification({body: res.error, success:false, errorStatus:403})
        }
    }

</script>

<div class='flex flex-col justify-start ml-3 gap-1'>
    <Togglebutton 
        containerClasses={'flex-row w-min'} 
        buttonClasses='text-nowrap p-1' 
        options={[{label: 'Existing Customer', value: 'existing'}, {label: 'New Customer', value: 'new'}]} 
        bind:value={exNew}
        
    />
    {#if (exNew == 'existing')}
        <TextInput
            placeholder='123456789'
            label='SSN: '
            nameId='SSN'
            value={form.SSN}
            numeric
            oninput={(e:HTMLInputElement) => {form.SSN = e.value}}
        />
    {:else}
    <p class="text-[24px] font-bold mb-4">Sign up New Customer</p>
        <TextInput 
            placeholder="ex. 123456789"
            label="SSN"
            numeric
            charLimit={9}
            value={form.SSN}
            nameId="SSN"
            oninput={(e:HTMLInputElement) => form.SSN = e.value}
            divClasses="relative"
            inputClasses="border border-black border-solid"
            labelClasses="font-bold mr-2"
            showBorder={true}
            borderColor="grey"
        />
        <p class="text-center text-[10px]">This will be used to identify you and to login. Please don't put your real SSN.</p>
        <PersonInfoInput
            person_state={form.name}
            changeName={(value:string, type:any) => form = {...stateChanges.handleNameChange(value, form, type), stay_end_date: form.stay_end_date}}
        />
        <AddressInput 
            addressValues={form.address}
            handleStreetChange={(value:string, type:any) => form = {...stateChanges.handleStreetChange(value, form, type), stay_end_date: form.stay_end_date}}
            handleAddressChange={(value:string, type:any) => form = {...stateChanges.handleAddressChange(value, form, type), stay_end_date: form.stay_end_date}}
        />
    {/if}
    <p class='text-18px'><span class='font-bold'>From:</span> Now</p>
     <Select 
        listOfOptions={toDayArr}
        singleValue={true}
        divClasses='gap-1 min-w-[150px]'
        labelClasses='text-nowrap min-w-[50px] font-bold'
        label='Until: '
        name='Day'
        selected={form.stay_end_date.day}
        changeSelected={(e:HTMLInputElement) => {form.stay_end_date.day = parseInt(e.value)}}
    />
    <Select 
        listOfOptions={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
        singleValue={true}
        label='  '
        labelClasses='text-nowrap min-w-[50px] font-bold'
        name='Month'
        selected={form.stay_end_date.month}
        changeSelected={(e:HTMLInputElement) => {
            form.stay_end_date.month = parseInt(e.value)
            if (monthDays[form.stay_end_date.month] < form.stay_end_date.day) {
                form.stay_end_date.day = 1
            }
        }}
    />
    <Select 
        listOfOptions={[...Array(10).keys()].map(n => n+(new Date().getFullYear()))}
        singleValue={true}
        label='  '
        labelClasses='text-nowrap min-w-[50px] font-bold'
        name='Year'
        selected={form.stay_end_date.year}
        changeSelected={(e:HTMLInputElement) => {form.stay_end_date.year = parseInt(e.value)}}
    />

    {#if data.minimum_stay[0].nearest_booking}
    <p class='text-[18px] my-10'>
        The nearest booking is {parse_date(data.minimum_stay[0].nearest_booking)} {parseYear(data.minimum_stay[0].nearest_booking)}
    </p>
    {:else}
    <p class='text-[18px] my-10'>
        No current future booking in this room
    </p>
    {/if}

    <Button 
        buttonClasses='p-2 rounded-lg bg-cyan-100 hover:bg-cyan-200 cursor-pointer border border-black my-5 w-[200px]'
        onClick={submit}
    >
        Rent Room
    </Button>
</div>