<script lang='ts'>
    import { goto } from "$app/navigation";
    import ArchiveSearch from "$lib/partial/blocks/archive_search.svelte";

    let {data} = $props()


</script>

<div class='flex ml-2 size-full'>
    <ArchiveSearch 
        data={data}
        gotoFunc={(searchQuery:string) => goto(`/hotel/${data.hotel_id}/manage/archives${searchQuery}`)}
        archiveBlockFunction={(aId:string) => goto(`/hotel/${data.hotel_id}/manage/archives/${aId}`)}
        hotel_side
    />
</div>