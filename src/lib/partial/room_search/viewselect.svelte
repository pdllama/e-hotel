<script lang="ts">
    import Select from "$lib/components/select/select.svelte";
    let {
        value=$bindable(''),
        selDivClasses=''
    } = $props()
</script>

<Select 
    name='view'
    bind:selected={value}
    divClasses={selDivClasses}
    changeSelected={(e:HTMLInputElement) => {value = e.value}}
    listOfOptions={[{name: 'Any', value: ''}, {name: 'None', value: 'none'}, {name: 'Mountain', value: 'mountain'}, {name: 'Sea', value: 'sea'}]}
    label='View'
/>