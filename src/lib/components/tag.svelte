<script lang="ts">
    let {
        text,
        hoverPopup=null
    } = $props()


</script>

<style>
    .tag-color {
        background-color: rgb(41, 1, 51); 
    }
</style>
<span class="tag-color rounded-lg p-1 text-white font-bold text-nowrap">{text}</span>