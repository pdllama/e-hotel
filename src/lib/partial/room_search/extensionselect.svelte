<script lang="ts">
    import Select from "$lib/components/select/select.svelte";
    let {
        value=$bindable(''),
        selDivClasses=''
    } = $props()
</script>

<Select 
    name='extension possible'
    bind:selected={value}
    divClasses={selDivClasses}
    changeSelected={(e:HTMLInputElement) => {value = e.value}}
    listOfOptions={[{name: 'Any', value: ''}, {name: 'Yes', value: 'true'}, {name: 'No', value: 'false'}]}
    label='Extension Possible?'
/>