<script lang="ts">
    import "./home-page.css"
    import TextInput from "$lib/components/text-input.svelte";
    import searchIcon from "$lib/assets/search-icon.png";
    import CardCarousel from "$lib/components/carousel/card-carousel/card-carousel.svelte";
    import { cityHotelData } from "$lib/util/testdata";
    import { enter_search } from "./search/search_logic";
    import SearchDebounceResult from "./search/searchdebounceresult.svelte";
    import { debounce } from "$lib/util/debounce";

    let countrySearch = $state("");
    let debounce_search_input = $state("");
    let focusedText = $state(false)
    function on_search(e: HTMLInputElement) {
        countrySearch = e.value;
    } 
    function clear_input() {
        countrySearch = ""; debounce_search_input="";
    }

    const debounceUpdate = debounce<string>((val) => {
        debounce_search_input = val;
    }, 750);

    //items={[{name: "Mexico City", numHotels: 634, avgPrice: 172}, {name: "random city", numHotels: 17, avgPrice: 87}]}
</script>

<div class='flex flex-col justify-start items-center home-main-container'>
    <div class="home-nav-decoration"></div>
<!-- <h1><b>Welcome to Domilux</b></h1>
<p>Book your hotels here</p>
<p>Home page</p> -->
    <div class="w-[100%] h-[50%] flex flex-col justify-center items-center z-100"> 
        <h1 class="font-bold text-4xl color-black w-[90%] max-w-[800px] align-start mb-8">Find your dream hotel</h1>
        <div class="w-full flex flex-col items-center justify-center relative">
        <TextInput 
            placeholder="Search Cities, Hotels, etc."
            nameId="country"
            divClasses="w-[90%] max-w-[800px] h-[50px] bg-white rounded-lg z-5"
            value={countrySearch}
            oninput={(e:HTMLInputElement) => {
                on_search(e);
                debounceUpdate(e.value);
            }}
            icon={searchIcon}
            iconAlt="search icon"
            clearHandler={clear_input}
            submitHandler={enter_search}
            submitText="SEARCH"
            focusInHandler={() => {focusedText = true}}
            focusOutHandler={() => {focusedText = false}}
        />
        <SearchDebounceResult
            search_query={debounce_search_input}
            change_actual_text={(c:string) => countrySearch = c}
            focused={focusedText}
            divClasses="
                flex w-[90%] max-w-[800px] items-center justify-center 
                rounded-sm rounded-t-none border border-t-[0] border-black 
                mx-2 absolute top-[48px] bg-white z-1
            "
        />
        </div>
        <!-- <form action="/">
            <label for="country">Country: </label>
            <input 
                type="text"
                id="country"
                name="country"
                oninput={on_search} 
                bind:value={countrySearch} 
                placeholder="search a country"
            />
        </form> -->
    </div>
    
</div>
<div class="flex flex-col justify-center items-start w-[90%] max-w-[800px]">
    <h2 class="font-bold">Popular Destinations</h2>
    <CardCarousel
        type="destination"
        items={cityHotelData}
    />
</div>
