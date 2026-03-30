<script lang="ts">
    import { notifications, removeNotification, type Notification, type NotificationDetails} from "./notificationStore";
    import { fade } from "svelte/transition";
</script>

<style>
    .noti-container {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        z-index: 100;
        min-width: 200px;
        
    }
    .noti-body {
        padding: 1rem;
        margin-bottom: 0.5rem;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
    }
    .success {
        background-color: #4CAF50; 
        color: white;
    }
    .error {
        background-color: #f44336; 
        color: white;
    }
</style>

<div class="noti-container">
    {#each $notifications as noti}
        <div class={`noti-body ${noti.success ? 'success' : 'error'}`}>
            {#if (!noti.success)}
                <p class='text-[20px] font-bold'>ERROR: {noti.errorStatus}</p>
            {/if}
            <p>{noti.body}</p>
            <button class='absolute top-[0px] right-[5px] w-[32px] h-[32px]' on:click={() => removeNotification(noti.id)}><span class='text-[24px]'>x</span></button>
        </div>
    {/each}
</div>