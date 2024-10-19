<script lang="ts">
	// import { onMount } from 'svelte';
	// import { supabase } from '$lib/supabase';
	// import { user } from '$lib/stores/authStore';
	// import { browser } from '$app/environment';
	import { SafeArea } from '@capacitor-community/safe-area'
	import '../app.css'
	// import { page } from '$app/stores';
	// import LanguageSelector from '$lib/components/LanguageSelector.svelte';
	import { ModeWatcher } from 'mode-watcher'
	import { user, getSession, setCurrentOrgId } from '$lib/backend'
	import { onMount } from 'svelte'
	// let notificationSupported = $state(false);
	import { locale } from '$lib/i18n'

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
		// First, try to get the locale from localStorage
		const storedLocale = localStorage.getItem('locale')
		if (storedLocale) {
			locale.set(storedLocale)
		}

		user.subscribe((user) => {
			if (user) {
				const userLocale = user.user_metadata?.i18n
				if (userLocale) {
					locale.set(userLocale)
					localStorage.setItem('locale', userLocale)
				}
				// Fetch currentOrgId from user metadata and set it
				const currentOrgId = user.user_metadata?.currentOrgId
				if (currentOrgId) {
					setCurrentOrgId(currentOrgId)
				}
			}
		})

		const { data } = await getSession()
		if (data.session) {
			user.set(data.session.user)
		}
	})

	/*
  onMount(() => {
    if (browser) {
      notificationSupported = 'Notification' in window;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      user.set(session?.user ?? null);
    
      if (browser && notificationSupported && event === 'SIGNED_IN') {
        if (Notification.permission === 'granted') {
          new Notification('Signed In', {
            body: 'You have successfully signed in.',
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  });

  function requestNotificationPermission() {
    if (browser && notificationSupported) {
      Notification.requestPermission();
    }
  }
  */
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
