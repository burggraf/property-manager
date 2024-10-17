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
	import { generateRandomContacts } from '$lib/contactService'
	let { data } = $props<{ data: PageData }>();

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

	async function handleAddRandomContacts() {
		const newContacts = await generateRandomContacts(20);
		data.contacts = [...data.contacts, ...newContacts];
	}

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
		<p class="error pt-6">{data.error}</p>
	{:else if data.contacts.length === 0}
		<p class="text-center text-gray-500 pt-6">{$t('contacts.noContacts')}</p>
	{:else}
		<ContactsList contacts={data.contacts} />
	{/if}
	
	<div class="mt-6 flex justify-center">
		<Button onclick={handleAddRandomContacts}>
			{$t('contacts.addRandomContacts', { default: 'Add 20 Random Contacts' })}
		</Button>
	</div>
</Content>
<StatusBar />
