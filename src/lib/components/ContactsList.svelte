<script lang="ts">
	import { goto } from '$app/navigation'
	import type { Contact } from '../types/contact'
	import { fetchContacts } from '$lib/contactService.svelte'
	import { getUser } from '$lib/backend.svelte'
	const user = $derived(getUser())
	import GenericList from './GenericList.svelte'
	import { createEventDispatcher } from 'svelte'

	let contacts: Contact[] = $state<Contact[]>([])
	let currentSortColumn = $state('lastname')
	let currentSortDirection = $state<'asc' | 'desc'>('asc')

	$effect(() => {
		if (user) {
			loadContacts(currentSortColumn, currentSortDirection)
		} else {
			contacts = []
		}
	})

	async function loadContacts(column: string = 'lastname', direction: 'asc' | 'desc' = 'asc') {
		try {
			const { data, error } = await fetchContacts(column, direction)
			if (error) {
				console.error('Error loading contacts:', error)
				contacts = []
			} else {
				contacts = data as Contact[]
			}
		} catch (error) {
			console.error('Error loading contacts:', error)
		}
	}

	async function handleSort(column: string, direction: 'asc' | 'desc') {
		currentSortColumn = column
		currentSortDirection = direction
		await loadContacts(column, direction)
	}

	function handleContactClick(contact: Contact) {
		goto(`/dashboard/contacts/${contact.id}`)
	}

	let selectedItems: Set<string> // array of ids

	const dispatch = createEventDispatcher()

	function handleSelectionChange(newSelection: Set<string>) {
		selectedItems = newSelection
		console.log('Selected items:', Array.from(selectedItems))
		dispatch('selectionChange', Array.from(selectedItems))
	}

	const headers = [
		{ key: 'firstname', label: 'contacts.firstname', sortable: true },
		{ key: 'lastname', label: 'contacts.lastname', sortable: true },
		{ key: 'email', label: 'contacts.email', sortable: true },
	]
</script>

<GenericList
	data={contacts}
	{headers}
	onRowClick={handleContactClick}
	onSort={handleSort}
	showCheckboxes={true}
	onSelectionChange={handleSelectionChange}
/>
