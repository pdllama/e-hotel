<script lang="ts">
    import TextInput from '$lib/components/text-input.svelte';
    import Button from '$lib/components/button.svelte';
    import PageBar from '../../../search/page-bar.svelte';
    import AddressInput from '$lib/partial/signup-form/address-input.svelte';
    import { StreetField, AddressField, NameField} from '../../../signup/signuplogic.js';
    import { addNotification } from '$lib/notificationStore.js';
    import Select from '$lib/components/select/select.svelte';
    import PersonInfoInput from '$lib/partial/signup-form/person-info-input.svelte';
    import { goto } from '$app/navigation';
    import { education } from '../../../../static/db_enum_types.js';

    let {data} = $props()

    let form:any = $state({
        chain_query: '',
        validChains: data.chains,
        page: 1,
        filteredChains: data.chains,
        selectedChain: '', 
        address: {street: {name: '', number: '', apt_number: ''}, postal_code: '', city: '', state: '', country: ''},
        SSN: '',
        checkedSSN: '',
        personName: {first_name: '', middle_name: '', last_name: ''},
        personAddress: {street: {name: '', number: '', apt_number: ''}, postal_code: '', city: '', state: '', country: ''},
        education_level: '',
        restAvailable: false,
        checkedSSNType: 'none'
    })

    let num_chains = 10

    const check_SSN = async() => {
        if (isNaN(parseInt(form.SSN))) {addNotification({body: 'SSN must be a non-empty numeric value!', success: false, errorStatus:403})}
        else {
            const res = await fetch(`/admin/hotels/new?SSN=${form.SSN}`, {method: 'GET'}).then(v => v.json())
            if (res.success) {
                const {type, person} = res
                form.checkedSSN = form.SSN
                form.restAvailable = true
                form.checkedSSNType = type
                form.person = person
            } else {
                addNotification({body: 'Something went wrong!', success: false, errorStatus:403})
            }
        }
    }

    const eduMapping = {
        'less_than_hs': 'Less than High School',
        'hs': 'High School',
        'undergraduate': 'Undergraduate Degree',
        'master': "Master's Degree",
        'phd': 'P.h.D.'
    }

    const nothingAddressWiseMissing = (address:any) => {
        if (address.street.number == '') {return false}
        if (address.street.name == '') {return false}
        if (address.postal_code == '') {return false}
        if (address.city == '') {return false}
        if (address.country == '') {return false}
        return true
    }

    const nothingMissing = () => {
        if (form.selectedChain == '') {return false}
        if (!(nothingAddressWiseMissing(form.address))) {return false}
        if (form.SSN == '') {return false}
        if (form.checkedSSNType == 'none' && (!nothingAddressWiseMissing(form.personAddress) || form.personName.first_name == '' || form.personName.last_name == '')) {return false}
        if (form.checkedSSNType != 'employee' && form.education_level == '') {return false}
        return true
    }

    const finalize = async() => {
        if (!nothingMissing) {addNotification({body: 'A required field is missing!', success:false, errorStatus:403})}
        else {
            const res = await fetch(`/admin/hotels/new`, {
                method: 'POST',
                body: JSON.stringify({chain_name: form.selectedChain, hotel_address: form.address, SSN: form.SSN, checkedSSNType: form.checkedSSNType, personAddress: form.personAddress, personName: form.personName, education_level: form.education_level})
            }).then(r => r.json())
            if (res.success) {
                addNotification({body: 'Added the Hotel!', success:true, errorStatus: 201});
                goto(`/admin/hotels/${res.hotel_id}`)
            } else {
                addNotification({body: res.error, success:false, errorStatus: 403})
            }
        }
    }

    type eduMappingType = typeof eduMapping

    $effect(() => {
        if (form.SSN != form.checkedSSN) {
            form.restAvailable = false
            form.checkedSSNType = ''
        }
    })

</script>

<div class='flex flex-col gap-2 ml-4'>
    <p class='font-bold text-[24px] mb-3'>Create New Hotel</p>

    <p class='font-bold text-[18px]'>Select Hotel Chain</p>
    <div class='flex flex-row'>
        <div class='w-[550px] border border-black rounded-lg flex flex-row'>
            <TextInput 
                placeholder='Grand Suites'
                label='Chain Name'
                nameId='chain_name'
                divClasses='w-[100%]'
                labelClasses='min-w-[100px]'
                nodivpadding
                value={form.chain_query}
                oninput={(e:HTMLInputElement) => {
                    form.chain_query = e.value
                }}
            /> 
            <Button 
                buttonClasses='p-2 bg-cyan-100 hover:bg-cyan-200 cursor-pointer border border-black rounded-lg w-[150px]' 
                onClick={() => {form.filteredChains = form.validChains.filter((vc:any)=> vc.chain_name.toUpperCase().indexOf(form.chain_query.toUpperCase()) != -1); form.page = 1}}
            >
                Search
            </Button>
        </div>
    </div>
    <div class='flex flex-col gap-1 max-w-[400px]'>
        {#each (form.filteredChains.slice((form.page-1)*num_chains, num_chains*form.page)) as fc}
            <Button 
                buttonClasses={`p-2 hover:bg-cyan-400 cursor-pointer rounded-lg w-[100%] h-[50px] ${form.selectedChain == fc.chain_name ? 'bg-cyan-200' : ''}`} 
                onClick={() => form.selectedChain == fc.chain_name ? form.selectedChain = '' : form.selectedChain = fc.chain_name}
            >
                <p class='font-bold text-[18px]'>{fc.chain_name}</p>
            </Button>
        {:else}
            <p class='text-[12px] italic'>No results found</p>
        {/each}
    </div>
    {#if (form.filteredChains.length != 0 && form.filteredChains.length > num_chains)}
    <div class='flex flex-row gap-6 items-center'>
        <PageBar 
            page={form.page}
            numResults={form.filteredChains.length}
            query=''
            queryString={''}
            numResultsPerPage={num_chains}
            customChangePage={(page:number) => form.page = page}
        />
    </div>
    {/if}
    <p class='text-[16px] font-bold my-10'>Selected Chain: {form.selectedChain == '' ? 'None' : form.selectedChain}</p>
    <p class='font-bold text-[18px]'>Enter Address</p>
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
    <p class='font-bold text-[18px] mt-4'>Enter Manager Information</p>
    <div class='flex flex-row gap-5 my-5'>
        <TextInput
            nameId='ssn'
            label='SSN: '
            placeholder={123456789}
            numeric
            divClasses="border border-black rounded-lg w-[300px]"
            labelClasses='font-bold w-[250px]'
            value={form.SSN}
            oninput={(e:HTMLInputElement) => form.SSN = isNaN(parseInt(e.value)) ? '' : parseInt(e.value)}
        />
        <Button
            buttonClasses='p-2 hover:bg-cyan-300 bg-cyan-200 cursor-pointer w-[100px] rounded-lg border border-black my-2'
            onClick={check_SSN}
        >
            Check SSN
        </Button>
    </div>
    {#if form.restAvailable}
    <p class='text-[14px]'>{form.checkedSSNType == 'none' ? "We couldn't find a person associated with that SSN. You will have to enter all their information." : form.checkedSSNType == 'person' ? "We found a person, but not an employee associated with that SSN." : "We found an employee in our system associated with that SSN."}</p>
    
    {#if form.checkedSSNType == 'none'}
        <PersonInfoInput 
            person_state={form.personName}
            changeName={(new_value:string, type:NameField) => {
                if (type == NameField.first_name) {form.personName.first_name = new_value}
                else if (type == NameField.middle_name) {form.personName.middle_name = new_value}
                else {form.personName.last_name = new_value}
            }}
        />
        <AddressInput 
            addressValues={form.personAddress}
            handleStreetChange={(value:string, type:StreetField) => {
                if (type == StreetField.number) {form.personAddress.street.number = isNaN(parseInt(value)) ? '' : parseInt(value)}
                else if (type == StreetField.name) {form.personAddress.street.name = value}
                else {form.personAddress.street.apt_number =  isNaN(parseInt(value)) ? '' : parseInt(value)}
            }}
            handleAddressChange={(value:string, type:AddressField) => {
                if (type == AddressField.postal_code) {form.personAddress.postal_code = value}
                else if (type == AddressField.city) {form.personAddress.city = value}
                else if (type == AddressField.state) {form.personAddress.state = value}
                else {form.personAddress.country = value}
            }}
        />
    {/if}
    {#if form.checkedSSNType != 'none'}
        <p class='text-[18px] mt-5'><span class='font-bold'>Name: </span> {form.person.first_name} {form.person.middle_name} {form.person.last_name}</p>
    {/if}
    {#if form.checkedSSNType != 'employee'}
        <div class='my-5'>
            <Select
                name='education_level'
                label="Education Level: "
                selected={form.education_level}
                listOfOptions={education.map((e:any) => {return {name: eduMapping[e as keyof eduMappingType], value: e}})}
                changeSelected={(e:HTMLSelectElement) => {form.education_level = e.value}}
                divClasses='gap-1 w-[300px]'
                labelClasses='text-nowrap min-w-[150px] font-bold'
            />
        </div>
    {/if}
    <div class='flex gap-5 my-5'>
        <Button
            buttonClasses='p-2 hover:bg-cyan-300 bg-cyan-200 cursor-pointer w-[200px] rounded-lg border border-black my-2'
            onClick={finalize}
        >
            Add New Hotel
        </Button>
    </div>
    {/if}
</div>