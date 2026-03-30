<script lang="ts">
	import './layout.css';
	import userIcon from '$lib/assets/user-profile-black.png';
	import Button from '$lib/components/button.svelte';
    import { goto } from '$app/navigation';
    import Notifications from '$lib/Notifications.svelte';
	// import favicon from '$lib/assets/favicon.svg'; // do this and href={favicon} next to rel="icon" to put custom icon into browser heading



	let { children, data } = $props();

</script>

<svelte:head><link rel="icon" /></svelte:head>

<Notifications/>
<div class="flex flex-col justify-center items-center min-h-screen m-0">
	<nav class="nav-container z-1">
		<div class="logo-container flex justify-center items-center">
			<a class="logo-text py-4 hover:opacity-50" href="/">DomiLux</a>
		</div>
		<div class="size-full flex justify-end items-center">
			<Button buttonClasses="nav-item-container" onClick={() => {goto(!data.user ? '/login' : `/user/${data.user.SSN}`)}}>
					<img src={userIcon} alt="user icon" width="20px" height="30px" class="opacity-75 m-2 ml-2"/>
					{#if (!data.user)}
					<p class="font-bold text-[14px] text-start w-[100%]">Sign in</p>
					{:else}
					<p class="font-bold text-[14px] text-start w-[100%]">{data.user.first_name}</p>
					{/if}
			</Button>
		</div>
		
	</nav>
	<div class="flex grow flex-col items-center w-[100%]">
		{@render children()}
	</div>
	<footer class="footer-container">

	</footer>
</div>
