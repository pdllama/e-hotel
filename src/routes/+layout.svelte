<script lang="ts">
	import './layout.css';
	import userIcon from '$lib/assets/user-profile-black.png';
	import Button from '$lib/components/button.svelte';
	// import favicon from '$lib/assets/favicon.svg'; // do this and href={favicon} next to rel="icon" to put custom icon into browser heading

	let { children } = $props();
</script>

<svelte:head><link rel="icon" /></svelte:head>
<div class="flex flex-col justify-center items-center min-h-screen m-0">
	<nav class="nav-container z-1">
		<div class="logo-container flex justify-center items-center">
			<p class="logo-text">DomiLux</p>
		</div>
		<div class="size-full flex justify-end items-center">
			<Button buttonClasses="nav-item-container" onClick={() => {}}>
					<img src={userIcon} alt="user icon" width="20px" height="30px" class="opacity-75 m-2 ml-2"/>
					<p class="font-bold text-[14px] text-start w-[100%]">Sign in</p>
			</Button>
		</div>
		
	</nav>
	<div class="flex grow flex-col items-center w-[100%]">
		{@render children()}
	</div>
	<footer class="footer-container">

	</footer>
</div>
