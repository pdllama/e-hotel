<script lang="ts">
    import "./home-page.css"
    import TextInput from "$lib/components/text-input.svelte";
    import searchIcon from "$lib/assets/search-icon.png";

    let countrySearch = $state("");
    function on_search(e: HTMLInputElement) {
        countrySearch = e.value;
    } 
    function clear_input() {
        countrySearch = "";
    }
</script>

<div class='flex flex-col justify-start items-center home-main-container'>
    <div class="home-nav-decoration"></div>
<!-- <h1><b>Welcome to Domilux</b></h1>
<p>Book your hotels here</p>
<p>Home page</p> -->
    <div class="w-[100%] h-[50%] flex flex-col justify-center items-center z-100"> 
        <h1 class="font-bold text-4xl color-black w-[90%] max-w-[600px] align-start mb-8">Find your dream hotel</h1>
        <TextInput 
            placeholder="Search Countries, Hotels"
            nameId="country"
            divClasses="w-[90%] max-w-[600px] h-[50px] bg-white rounded-lg"
            value={countrySearch}
            oninput={on_search}
            icon={searchIcon}
            iconAlt="search icon"
            clearHandler={clear_input}
        />
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
