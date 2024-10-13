<script lang="ts">
	import { goto } from '$app/navigation'
	// import { onMount } from 'svelte';
	import ContactsList from '$lib/components/ContactsList.svelte'
	import { Button } from '$lib/components/ui/button'
	import type { PageData } from './$types'
	import { t } from '$lib/i18n'
	import Actions from '$lib/components/Actions.svelte'
	import { 
		UserPlus,
		Info
	} from 'lucide-svelte';
    import Navbar from '$lib/components/Navbar.svelte';
    import Content from '$lib/components/Content.svelte';
    import StatusBar from '$lib/components/StatusBar.svelte';
	import { user, getSession } from '$lib/backend';
	import { onMount } from 'svelte'

	let { data } = $props<{ data: PageData }>();
    onMount(() => {
      getSession().then(({ data }) => {
        if (data.session) {
          user.set(data.session.user);
          // Fetch user's language preference here
        }
      });
    });

	function handleNewContact() {
		goto('/dashboard/contacts/new');
	}
	let actions = $derived([
		{
			icon: UserPlus,
			title: $t('contacts.createNew'),
			action: handleNewContact
		},
		{
			icon: Info,
			title: 'Info',
			action: () => {
				console.log('Info action triggered');
			}
		}
	]);

</script>
<!--<div class="flex flex-col min-h-screen pt-[var(--header-height)]">-->

<Navbar>
    <div slot="title">{$t('contacts.title')}</div>
	<div slot="top-right" class="flex items-center space-x-2">
		<Button onclick={handleNewContact} variant="ghost" size="icon">
			<UserPlus class="h-5 w-5" />
			<span class="sr-only">New Contact</span>
		</Button>
		<Actions {actions} />
	</div>
</Navbar>
<Content>
	{#if data.error}
		<p class="error">{data.error}</p>
	{:else if data.contacts.length === 0}
		<p>{$t('contacts.noContacts')}</p>
	{:else}
		<ContactsList contacts={data.contacts} />
	{/if}
</Content>
<StatusBar />
