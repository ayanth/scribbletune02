import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 3000,
		host: '0.0.0.0',
		watch: {
			usePolling: true,
			interval: 1000
		},
		hmr: {
			port: 3000,
			host: 'localhost'
		}
	},
	// Ensure API routes are handled by SvelteKit, not proxied
	define: {
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
	}
});

