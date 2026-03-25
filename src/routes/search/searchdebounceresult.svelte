<script lang="ts">
    import { setContext } from "svelte";
    import SmallResultBlock from "./small_result_block.svelte";

    let {
        search_query,
        change_actual_text,
        focused,
        divClasses=""
    } = $props()

    let search_results = $state([])
    let force_hide = $state(false)
    let hovered_inner = $state(false)

    $effect(() => {
        force_hide = false
        if (search_query != "") {
            fetch(`/search?q=${search_query}&debounced=true`, {method: 'GET'})
                .then(v => v.json())
                .then(v => search_results = v)
        }
    })
    
</script>

<!-- Note: there is a stutter because of the time the query updates (ie typed in a query) vs the time the query returns. Low priority fix -->

{#if (search_query != "" && !force_hide && (focused || hovered_inner))}
    <div 
        class={`${divClasses} flex-col`}
        onmouseenter={() => hovered_inner = !hovered_inner}
        onmouseleave={() => hovered_inner = !hovered_inner}
        aria-label="search results"
        aria-describedby="search results for your query"
        role="button"
        tabindex={0}
    >
        {#each search_results as r}
            <SmallResultBlock
                item={r}
                change_search_input={(c:string) => {change_actual_text(c); force_hide = true}}
            />
        {:else}
            <div class="w-[100%] h-[40px] flex items-center ml-2">
                <p class="text-bold text-[22px] italic">No Results</p>
            </div>
        {/each}
    </div>
{/if}