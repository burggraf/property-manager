<script lang="ts">
	import { goto } from '$app/navigation'
	// import { onMount } from 'svelte';
	import ContactsList from '$lib/components/ContactsList.svelte'
	import { Button } from '$lib/components/ui/button'
	import type { PageData } from './$types'
	import { t } from '$lib/i18n'
	import Actions from '$lib/components/Actions.svelte'
	import { UserPlus, Info, Trash2 } from 'lucide-svelte'
	import Navbar from '$lib/components/Navbar.svelte'
	import Content from '$lib/components/Content.svelte'
	import StatusBar from '$lib/components/StatusBar.svelte'
	import { getUser, getSession, getCurrentOrgId } from '$lib/backend.svelte'
	import { onMount } from 'svelte'
	import { generateRandomContacts } from '$lib/contactService.svelte'
	import type { Contact } from '$lib/types/contact'
	import type { Action } from '$lib/types/action'
	import { deleteContact } from '$lib/contactService.svelte'
	import { showToast } from '$lib/utils/toast'

	const user = $derived(getUser())
	let { data } = $props<{ data: PageData }>()
	let selectedContacts: string[] = $state([])
	const currentOrgId = $derived(getCurrentOrgId())
	function handleNewContact() {
		goto('/dashboard/contacts/new')
	}

	function handleDeleteContacts() {
		if (selectedContacts.length === 0) return

		const confirmMessage =
			selectedContacts.length === 1
				? $t('contacts.confirmDeleteSingle')
				: $t('contacts.confirmDeleteMultiple')

		if (confirm(confirmMessage)) {
			console.log(`Deleting ${selectedContacts.length} contacts`)
			Promise.all(
				selectedContacts.map(async (contactId) => {
					const { error } = await deleteContact(contactId)
					if (error) {
						showToast($t('contacts.deleteContactError'), { type: 'error' })
						console.error('Error deleting contact:', error)
						throw error
					}
				})
			)
				.then(() => {
					selectedContacts = []
					window.location.reload()
				})
				.catch((error) => {
					console.error('Error deleting contacts:', error)
					showToast($t('contacts.deleteContactsError'), { type: 'error' })
				})
		}
	}

	let actions = $derived([
		{
			icon: UserPlus,
			title: $t('contacts.createNew'),
			action: handleNewContact,
		},
		{
			icon: Info,
			title: 'Info',
			action: () => {
				console.log('Info action triggered')
			},
		},
		{
			icon: Trash2,
			title: selectedContacts.length > 0 ? `Delete (${selectedContacts.length})` : 'Delete',
			action: handleDeleteContacts,
			disabled: selectedContacts.length === 0,
		},
	])

	async function handleAddRandomContacts() {
		const newContacts = await generateRandomContacts(20)
		console.log('goto contacts page')
		window.location.reload()
		//goto('/dashboard/contacts', { replaceState: true })
		//data.contacts = [...data.contacts, ...newContacts]
	}

	function handleContactSelection(event: CustomEvent<string[]>) {
		selectedContacts = event.detail
		console.log('Selected contacts in parent:', selectedContacts)
	}
</script>

<!--<div class="flex flex-col min-h-screen pt-[var(--header-height)]">-->

<Navbar>
	<div slot="title">{$t('contacts.title')}</div>
	<div slot="top-right" class="flex items-center space-x-2">
		<Button on:click={handleNewContact} variant="ghost" size="icon">
			<UserPlus class="h-5 w-5" />
			<span class="sr-only">New Contact</span>
		</Button>
		<Actions {actions} />
	</div>
</Navbar>
<Content>
	{#if currentOrgId}
		{#if data.error}
			<p class="error pt-6">{data.error}</p>
		{:else if data.contacts.length === 0}
			<p class="text-center text-gray-500 pt-6">{$t('contacts.noContacts')}</p>
			<div class="mt-6 flex justify-center">
				<Button onclick={handleAddRandomContacts}>
					{$t('contacts.addRandomContacts')}
				</Button>
			</div>
		{:else}
			<ContactsList contacts={data.contacts} on:selectionChange={handleContactSelection} />
			<div class="mt-6 flex justify-center">
				<Button onclick={handleAddRandomContacts}>
					{$t('contacts.addRandomContacts')}
				</Button>
			</div>
		{/if}
	{:else}
		<p class="text-center text-gray-500 pt-6">{$t('contacts.noOrgSelected')}</p>
	{/if}
</Content>
<StatusBar />
