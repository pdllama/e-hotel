<script lang="ts">
    import TextInput from "$lib/components/text-input.svelte";
    import searchIcon from "$lib/assets/search-icon.png"
    import { enter_search } from "./searchlogic";
    import { debounce } from "$lib/util/debounce";
    import SearchDebounceResult from "./searchdebounceresult.svelte";

    let search_input = $state("");
    let debounce_search_input = $state("");
    let show_result = $state(false)
    function clear() {search_input = "";}
    function input_search(e:HTMLInputElement) {search_input = e.value; show_result = false;}

    const debounceUpdate = debounce<string>((val) => {
        debounce_search_input = val;
        show_result = true;
    }, 750);

    $inspect(debounce_search_input)

</script>


<div class="flex flex-col size-full max-w-[1000px] justify-start items-center gap-2">
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
            submitHandler={enter_search}
            submitText="SEARCH"
        />
        <SearchDebounceResult
            search_query={debounce_search_input}
            divClasses="w-[100%] max-w-[1000px] h-[50px] bg-white rounded-lg"
        />
    </div>
    <div class="flex flex-col w-[80%] min-h-[400px] items-center justify-center">
        <p class="text-gray-500 italic text-size-[16px]">No search data</p>
    </div>
</div>
