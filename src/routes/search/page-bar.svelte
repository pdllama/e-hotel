<script lang='ts'>
    import Button from "$lib/components/button.svelte";
    import { change_page, createPagination } from "./search_logic";
    type Pagination = {leftPagination: (number|'...')[], rightPagination: (number|'...')[]}

    let {
        page=$bindable(1),
        numResults=$bindable(0),
        query,
        queryString
    } = $props()

    let maxPage = Math.ceil(numResults % 10 == 0 ? numResults/10-1 : numResults/10)

    const pagination:Pagination = $derived(createPagination(page, maxPage))
    const iteration = $derived([...pagination.leftPagination, page, ...pagination.rightPagination])

    const handleChangePage = (newPage:number) => {
        let oldPage = page;
        page = newPage;
        change_page(query, queryString, newPage, oldPage)
    }

    //${p == '...' ? '' : 'border border-gray-500'}
</script>

{#each iteration as p}
    {#if (page == p || p == '...')}
        <div class={`w-[${p == '...' ? '32' : '40'}px] h-[${p == '...' ? '32' : '40'}px] flex justify-center items-center rounded rounded-lg`}>
            <p class={`text-[${p == '...' ? '24' : '32'}px] font-bold`}>{p}</p>
        </div>
    {:else}
        <Button 
            buttonClasses='w-[32px] h-[32px] flex justify-center items-center rounded rounded-lg border border-gray-500 bg-gray-200 p-3 hover:bg-gray-600'
            onClick={() => handleChangePage(p)}
        >
            <p class='text-[24px] font-bold'>{p}</p>
        </Button>
    {/if}
{/each}


