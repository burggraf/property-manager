<script lang="ts">
	import { goto } from '$app/navigation'
	import { t } from '$lib/i18n'
	import { saveContact } from '$lib/contactService.svelte'
	let firstname = ''
	let lastname = ''
	let email = ''
	let notes = ''

	async function handleSubmit() {
		const { error } = await saveContact({ id: '', firstname, lastname, email, notes })

		if (error) {
			console.error('Error submitting form:', error)
		} else {
			goto('/dashboard/contacts')
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
	<input
		bind:value={firstname}
		placeholder={$t('contacts.firstName')}
		required
		class="w-full p-2 border rounded"
	/>
	<input
		bind:value={lastname}
		placeholder={$t('contacts.lastName')}
		required
		class="w-full p-2 border rounded"
	/>
	<input
		bind:value={email}
		type="email"
		placeholder={$t('contacts.email')}
		required
		class="w-full p-2 border rounded"
	/>
	<textarea
		bind:value={notes}
		placeholder={$t('contacts.notes')}
		required
		class="w-full p-2 border rounded h-32"
	></textarea>
	<button type="submit" class="w-full p-2 bg-blue-500 text-white rounded">
		{$t('contacts.save')}
	</button>
</form>
