<script lang='ts'>
    import Problemblock from "$lib/partial/ui/problemblock.svelte";
    import TextInput from "$lib/components/text-input.svelte";
    import PageBar from "../../../../search/page-bar.svelte";
    import Button from "$lib/components/button.svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    
    let {data} = $props()
    let room_num = $state(data.initState)

    const search = () => {
        goto(`/hotel/${data.hotel_id}/manage/problems${room_num.room ? `?room=${room_num.room}` : ''}`)
    }

    function changePage(p:number) {
        const sq = room_num.room ? `room=${room_num.room}` : ''
        if (p == 1) {goto(`/hotel/${data.hotel_id}/manage/problems${sq != '' ? `?${sq}` : ''}`)}
        else {goto(`/hotel/${data.hotel_id}/manage/problems?p=${p}${sq != '' ? `&${sq}` : ''}`)}
    }


</script>

<div class='flex flex-col ml-3 gap-3 mb-3'>
    <p class='font-bold text-[24px] my-3'>See Problems</p>
    <TextInput
        nameId='room'
        label='Room Number: '
        placeholder='231'
        divClasses="border border-black rounded-lg w-[300px]"
        numeric
        labelClasses='font-bold w-[250px]'
        value={room_num.room}
        oninput={(e:HTMLInputElement) => room_num.room = e.value == '' ? '' : parseInt(e.value)}
    />
    <Button
        buttonClasses='p-2 hover:bg-cyan-300 bg-cyan-200 cursor-pointer w-[150px] min-h-[50px] rounded-lg border border-black'
        onClick={search}
    >
        Search
    </Button>
    <p class='font-bold'>Results:</p>
    {#each data.problems as problem}
        <Problemblock
            problem_data={problem}
        />
    {:else}
        <div class="flex flex-col size-full justify-center items-center">
            <p class='text-[12px] italic'>No results found</p>
        </div>
    {/each}
    {#if (data.problems[0] !== undefined && !isNaN(parseInt(data.problems[0].totalcount)) && parseInt(data.problems[0].totalcount) > 10)}
        <div class='flex flex-row items-center gap-4 mb-5'>
            <PageBar 
                page={room_num.page == 0 ? 1 : room_num.page}
                numResults={data.problems[0] == undefined ? 0 : parseInt(data.problems[0].totalcount)}
                query=''
                queryString={page.url.search.slice(1, page.url.search.length)}
                numResultsPerPage={10}
                customChangePage={(page:number) => changePage(page)}
            />
        </div>
        {/if}
</div>