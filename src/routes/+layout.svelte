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
	import { onMount } from 'svelte'
	// let notificationSupported = $state(false);

    SafeArea.enable({
      config: {
        customColorsForSystemBars: true,
        statusBarColor: '#00000000', // transparent
        statusBarContent: 'light',
        navigationBarColor: '#00000000', // transparent
        navigationBarContent: 'light',
      },
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
<div class="safe-area-top safe-area-bottom overflow-clip h-[calc(100vh_-_var(--safe-area-inset-top)_-_var(--safe-area-inset-bottom))]">
    <slot />
</div>
