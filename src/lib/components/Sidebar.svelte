<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';
	import { user } from '$lib/backend';
	import SidebarHeader from '$lib/components/SidebarHeader.svelte';
	import SidebarAuth from '$lib/components/SidebarAuth.svelte';
	import SidebarMenu from '$lib/components/SidebarMenu.svelte';
	import SidebarFooter from '$lib/components/SidebarFooter.svelte';
	import LoginModal from "$lib/components/LoginModal.svelte";
	import { Home, Users, Settings } from 'lucide-svelte'

	export let closeSheet: () => void;
	let loginModalOpen = false;
	$: sidebarNavigation = [
		{
			category: $t('sidebar.people'),
			icon: Users,
			items: [
				{ label: $t('sidebar.contacts'), href: "/dashboard/contacts" },
				{ label: $t('sidebar.myAccount'), href: "/dashboard/account" }
			]
		},
		{
			category: $t('sidebar.dashboard'),
			icon: Home,
			items: [
				{ label: $t('sidebar.overview'), href: "/dashboard" },
				{ label: $t('sidebar.analytics'), href: "/dashboard/analytics" }
			]
		},
		{
			category: $t('sidebar.settings'),
			icon: Settings,
			items: [
				...$user ? [{ label: $t('sidebar.account'), href: "/dashboard/account" }] : [],
				{ label: $t('sidebar.language'), href: "/dashboard/language" },
			]
		}
	];
	// ... existing sidebarNavigation logic ...
</script>

<SidebarHeader />
<SidebarAuth {user} bind:loginModalOpen />
<SidebarMenu {sidebarNavigation} {closeSheet} />
<SidebarFooter />

<!-- Login Modal -->
<LoginModal bind:open={loginModalOpen} />
