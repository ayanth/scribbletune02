<script>
	import '../app.css';
</script>

<main>
	<slot />
</main>

<style>
	main {
		width: 100%;
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Inter', sans-serif;
	}
</style>
