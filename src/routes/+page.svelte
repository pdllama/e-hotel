<script>
    import "./home-page.css"
    import TextInput from "$lib/components/text-input.svelte";
    import searchIcon from "$lib/assets/search-icon.png";

    let countrySearch = $state("");
    function on_search(event) {
        countrySearch = event.target.value;
    } 
</script>

<div class='flex flex-col justify-start items-center home-main-container'>
    <div class="home-nav-decoration"></div>
<!-- <h1><b>Welcome to Domilux</b></h1>
<p>Book your hotels here</p>
<p>Home page</p> -->
    <div class="w-[100%] h-[50%] flex flex-col justify-center items-center z-100"> 
        <TextInput 
            placeholder="Search Countries, Hotels"
            nameId="country"
            divClasses="w-[90%] max-w-[600px] h-[50px] bg-white rounded-lg"
            value={countrySearch}
            oninput={on_search}
            icon={searchIcon}
            iconAlt="search icon"
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
