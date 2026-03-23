<script lang="ts">
    let {
        search_query,
        divClasses=""
    } = $props()

    $effect(() => {
        if (search_query != "") {

        }
    })
</script>

{#if (search_query != "")}
    <div class={divClasses}>

    </div>
{/if}