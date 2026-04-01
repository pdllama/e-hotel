<script lang="ts">
    import Select from "$lib/components/select/select.svelte";
    let {
        value=$bindable(''),
        selDivClasses=''
    } = $props()
</script>

<Select 
    name='capacity'
    bind:selected={value}
    divClasses={selDivClasses}
    changeSelected={(e:HTMLInputElement) => {value = e.value}}
    listOfOptions={[{name: 'Any', value: ''}, {name: '1', value: '1'}, {name: '2', value: '2'}, {name: '4', value: '4'}]}
    label='Capacity'
/>