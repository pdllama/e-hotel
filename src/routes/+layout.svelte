<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="flex flex-col justify-center items-center min-h-screen m-0">
	<nav class="nav-container">

	</nav>
	<div class="flex grow flex-col items-center">
		{@render children()}
	</div>
	<footer class="footer-container">

	</footer>
</div>
