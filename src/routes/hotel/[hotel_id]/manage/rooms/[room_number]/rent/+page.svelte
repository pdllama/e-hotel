<script lang='ts'>
    import TextInput from "$lib/components/text-input.svelte";
    import Togglebutton from "$lib/components/togglebutton/togglebutton.svelte";
    import { monthDays } from "../../../../../../../db/seeding/seedingutils";
    import Select from "$lib/components/select/select.svelte";

    let addressInit = {
        street: {name: '', number: '', apt_number:''},
        postal_code: '',
        city: '',
        state: '',
        country: ''
    }

    

    let form = $state({SSN: '', first_name: '', middle_name: '', last_name: '', address: addressInit, stay_end_date: {year: 0, month: 0, day: 0} })
    let exNew = $state('existing')

    let toDayArr = $derived([...Array(form.stay_end_date.month? monthDays[form.stay_end_date.month] : 31).keys()].map(n => n+1))

</script>

<div class='flex flex-col justify-start ml-3 gap-1'>
    <Togglebutton options={[{label: 'Existing Customer', value: 'existing'}, {label: 'New Customer', value: 'new'}]} value={exNew}/>
    {#if (exNew = 'existing')}
        <TextInput
            placeholder='123456789'
            label='SSN: '
            nameId='SSN'
            value={form.SSN}
            numeric
            oninput={(e:HTMLInputElement) => {form.SSN = e.value}}
        />
        <Select 
            listOfOptions={toDayArr}
            singleValue={true}
            divClasses='gap-1 min-w-[150px]'
            labelClasses='text-nowrap min-w-[50px] font-bold'
            label='Until: '
            name='Day'
            selected={form.stay_end_date.day.toString()}
            changeSelected={(e:HTMLInputElement) => {form.stay_end_date.day = parseInt(e.value)}}
        />
        <Select 
            listOfOptions={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
            singleValue={true}
            name='Month'
            selected={form.stay_end_date.month.toString()}
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
            name='Year'
            selected={form.stay_end_date.year.toString()}
            changeSelected={(e:HTMLInputElement) => {form.stay_end_date.year = parseInt(e.value)}}
        />
    {:else}
    <div></div>
    {/if}
</div>