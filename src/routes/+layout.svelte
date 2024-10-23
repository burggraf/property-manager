<script lang="ts">
	import { initializeUser } from '$lib/backend.svelte'
	import { SafeArea } from '@capacitor-community/safe-area'
	import '../app.css'
	import { ModeWatcher } from 'mode-watcher'
	import { getUser, getSession } from '$lib/backend.svelte'
	import { onMount } from 'svelte'
	// let notificationSupported = $state(false);
	import { getLocale, setLocale } from '$lib/i18n'
	const user = $derived(getUser())

	SafeArea.enable({
		config: {
			customColorsForSystemBars: true,
			statusBarColor: '#00000000', // transparent
			statusBarContent: 'light',
			navigationBarColor: '#00000000', // transparent
			navigationBarContent: 'light',
		},
	})
	onMount(async () => {
		initializeUser()
		// First, try to get the locale from localStorage
		const storedLocale = localStorage.getItem('locale')
		if (storedLocale) {
			setLocale(storedLocale)
		}
	})
</script>

<ModeWatcher />

<svelte:head>
	<title>{__APP_TITLE__} {__APP_VERSION__}</title>
	<!--
  {#if browser && notificationSupported}
    <script>
      // Request notification permission when the page loads
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    </script>
  {/if}
  -->
</svelte:head>

<!--<div class="p-safe-or-8 m-safe-or-8 overflow-auto pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] h-[calc(100vh_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))]">-->
<!--
<div class="safe-area-top safe-area-bottom p-safe-or-8 m-safe-or-8 overflow-auto pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] h-[calc(100vh_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))]">
-->
<div
	class="safe-area-top safe-area-bottom overflow-clip h-[calc(100vh_-_var(--safe-area-inset-top)_-_var(--safe-area-inset-bottom))]"
>
	<slot />
</div>
