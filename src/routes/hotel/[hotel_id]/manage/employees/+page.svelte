<script lang='ts'>
    import Problemblock from "$lib/partial/ui/problemblock.svelte";
    import TextInput from "$lib/components/text-input.svelte";
    import PageBar from "../../../../search/page-bar.svelte";
    import Button from "$lib/components/button.svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import Employeeblock from "$lib/partial/ui/employeeblock.svelte";
    import Select from "$lib/components/select/select.svelte";
    import { employeeRoles } from "../../../../../static/db_enum_types";
    
    let {data} = $props()
    let search = $state(data.search_state)

    const getSq = () => {
        return `${search.name ? `name=${search.name}` : ''}${search.role ? `${search.name ? '&' : ''}role=${search.role}` : ''}`
    }

    const search_func = () => {
        const sq = getSq()
        goto(`/hotel/${data.hotel_id}/manage/employees${sq ? `?${sq}` : ''}`)
    }

    function changePage(p:number) {
        const sq = getSq()
        if (p == 1) {goto(`/hotel/${data.hotel_id}/manage/employees${sq != '' ? `?${sq}` : ''}`)}
        else {goto(`/hotel/${data.hotel_id}/manage/employees?p=${p}${sq != '' ? `&${sq}` : ''}`)}
    }

</script>

<div class='flex flex-col ml-3 gap-3 mb-3'>
    {#if (data.user.is_manager)} 
        <Button
            buttonClasses='p-2 hover:bg-cyan-300 bg-cyan-200 cursor-pointer w-[150px] rounded-lg border border-black'
            onClick={() => goto(`/hotel/${data.hotel_id}/manage/employees/new`)}
        >
            New Employee
        </Button>
    {/if}
    <p class='font-bold text-[24px] my-3'>See Employees</p>
    <TextInput
        nameId='name'
        label='Name: '
        placeholder='John Smith'
        divClasses="border border-black rounded-lg w-[300px]"
        labelClasses='font-bold w-[250px]'
        value={search.name}
        oninput={(e:HTMLInputElement) => search.name = e.value }
    />
    <Select
        name='role'
        label='Role: '
        selected={search.role}
        singleValue
        listOfOptions={['', ...employeeRoles]}
        changeSelected={(e:HTMLSelectElement) => {search.role = e.value}}
        divClasses='gap-1 w-[300px]'
        labelClasses='text-nowrap min-w-[50px] font-bold'
    />
    <Button
        buttonClasses='p-2 hover:bg-cyan-300 bg-cyan-200 cursor-pointer w-[150px] rounded-lg border border-black'
        onClick={search_func}
    >
        Search
    </Button>
    <p class='font-bold'>Results:</p>
    {#each data.results as emp}
        <Employeeblock 
            height={data.user.is_manager ? '80px' : '60px'}
            employee={emp}
            manager_view={data.user.is_manager}
            onClick={() => goto(`/hotel/${data.hotel_id}/manage/employees/${emp.ssn}`)}
        />
    {:else}
        <div class="flex flex-col justify-center items-center">
            <p class='text-[12px] italic'>No results found</p>
        </div>
    {/each}
    {#if (data.results[0] !== undefined && !isNaN(parseInt(data.results[0].totalcount)) && parseInt(data.results[0].totalcount) > 10)}
        <div class='flex flex-row items-center gap-4 mb-5'>
            <PageBar 
                page={search.page == 0 ? 1 : search.page}
                numResults={data.results[0] == undefined ? 0 : parseInt(data.results[0].totalcount)}
                query=''
                queryString={page.url.search.slice(1, page.url.search.length)}
                numResultsPerPage={10}
                customChangePage={(page:number) => changePage(page)}
            />
        </div>
    {/if}
</div>