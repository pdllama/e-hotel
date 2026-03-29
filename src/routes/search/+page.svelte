<script lang="ts">
    import TextInput from "$lib/components/text-input.svelte";
    import searchIcon from "$lib/assets/search-icon.png"
    import { debounce } from "$lib/util/debounce";
    import SearchDebounceResult from "./searchdebounceresult.svelte";
    import { enter_search } from "./search_logic";
    import { onMount } from "svelte";
    import ResultBlock from "./result_block.svelte";
    import type { PageProps } from "../$types";
    import { page } from "$app/state";
    import FilterBar from "./filter-bar.svelte";

    interface SearchResult {search_results: any[]}

    // This will scream at you. Ignore it. It works.
    let { data, otherQueries }: SearchResult = $props();
    const q = page.url.searchParams.get('q');

    let search_input = $state(q ? q : '');
    let debounce_search_input = $state("");
    let focusedText = $state(false)
    

    function clear() {search_input = ""; debounce_search_input=""}
    function input_search(e:HTMLInputElement) {search_input = e.value;}

    const debounceUpdate = debounce<string>((val) => {
        debounce_search_input = val;
    }, 750);

</script>


<div class="flex flex-col size-full max-w-[1000px] justify-start items-center gap-2 relative">
    <div class="flex w-[80%] items-center justify-center rounded-sm border border-black mx-2">
        <TextInput
            placeholder="Search Cities, Hotels, etc."
            nameId="country"
            divClasses="w-[100%] max-w-[1000px] h-[50px] bg-white rounded-lg"
            value={search_input}
            oninput={(e:HTMLInputElement) => {
                input_search(e);
                debounceUpdate(e.value);
            }}
            icon={searchIcon}
            iconAlt="search icon"
            clearHandler={clear}
            submitHandler={() => enter_search(search_input, page.url.search.slice(1, page.url.search.length))}
            submitText="SEARCH"
            focusInHandler={() => focusedText=true}
            focusOutHandler={() => focusedText=false}
        />
        
    </div>
    <SearchDebounceResult
        search_query={debounce_search_input}
        change_actual_text={(c:string) => search_input = c}
        focused={focusedText}
        divClasses="
            flex w-[80%] items-center justify-center 
            rounded-sm rounded-t-none border border-t-[0] border-black 
            mx-2 absolute top-[52px] bg-white
        "
    />
    <div class="size-full flex justify-start align-center gap-5 my-8">

        <FilterBar currentQ={search_input}/>
        <div class={`flex flex-col w-[80%] min-h-[400px] justify-${data.search_results.length == 0 ? 'center' : 'start'} gap-1`}>
            {#if (data.search_results.length != 0)}
            <p class="mb-1 text-[12px] italic">{data.search_results[0].totalcount} results found</p>
            {/if}
            {#each data.search_results as result}
                <ResultBlock
                    hotel={result}
                />
            {:else}
                <p class="text-gray-500 italic text-[24px] font-bold text-center">No results</p>
            {/each}
        </div>
    </div>
</div>
