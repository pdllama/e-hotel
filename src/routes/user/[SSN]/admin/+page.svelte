<script lang="ts">
    import Button from "$lib/components/button.svelte";
    import { goto } from "$app/navigation";
</script>

<div class='flex flex-col my-3'>
    <p>Go to the admin route here</p>
    <Button buttonClasses='p-2 bg-indigo-200 rounded-lg mt-5 w-[150px] hover:bg-indigo-300' onClick={() => goto(`/admin`)}>Go to Admin</Button>
</div>