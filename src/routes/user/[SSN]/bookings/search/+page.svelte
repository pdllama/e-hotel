<script lang='ts'>
    import { goto } from "$app/navigation";
    import ArchiveSearch from "$lib/partial/blocks/archive_search.svelte";

    let {data} = $props()


</script>

<div class='flex ml-2 size-full'>
    <ArchiveSearch 
        data={data}
        gotoFunc={(searchQuery:string) => goto(`/user/${data.user.SSN}/bookings/search${searchQuery}`)}
        archiveBlockFunction={(aId:string) => goto(`/user/${data.user.SSN}/bookings/${aId}`)}
    />
</div>