<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { getSession } from '$lib/backend.svelte'

	onMount(async () => {
		const { error } = await getSession()
		if (error) {
			console.error('Error getting session:', error)
		}
		const redirectUrl = localStorage.getItem('redirectUrl') || '/'
		localStorage.removeItem('redirectUrl')
		// Redirect to home page or dashboard after successful login
		goto(redirectUrl)
	})
</script>

<div>Processing login...</div>
