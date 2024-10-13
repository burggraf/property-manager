<script lang="ts">
	import { onMount } from 'svelte'
	import { user, getSession } from '$lib/backend';
	import { Button } from '$lib/components/ui/button/index.js'
	import { Input } from '$lib/components/ui/input/index.js'
	import { Label } from '$lib/components/ui/label/index.js'
	import * as Card from '$lib/components/ui/card/index.js'
	import { t } from '$lib/i18n'
	import { updateUser } from '$lib/backend';
	import { showToast } from '$lib/utils/toast'
	import { Textarea } from '$lib/components/ui/textarea/index.js'
    import Navbar from '$lib/components/Navbar.svelte';
    import Content from '$lib/components/Content.svelte';
    import StatusBar from '$lib/components/StatusBar.svelte';
	import { Check, X, Trash2 } from 'lucide-svelte'

	let firstName = $state('')
	let lastName = $state('')
	let email = $state('')	
	let bio = $state('')
	let loading = false
	$effect(() => {
		// console.log('$user', $user)

		// This will run whenever $user changes
		if ($user) {
			firstName = $user.user_metadata?.first_name || ''
			lastName = $user.user_metadata?.last_name || ''
			email = $user.email || ''
			bio = $user.user_metadata?.bio || ''
		} else {
			firstName = ''
			lastName = ''
			email = ''
			bio = ''
		}
	});


/*
	onMount(() => {
		
		user.subscribe((currentUser) => {
			if (currentUser) {
				firstName = currentUser.user_metadata?.first_name || ''
				lastName = currentUser.user_metadata?.last_name || ''
				email = currentUser.email || ''
			}
		})
	})
		*/

	async function updateProfile() {
		loading = true
		const { data, error } = await updateUser({
			data: { first_name: firstName, last_name: lastName, bio: bio },
		})
		if (error) {
			showToast('Failed to update profile', { type: 'error' })
			console.error('Error updating profile:', error)
		} else {
			user.set(data.user || data)
			showToast('Profile updated successfully', { type: 'success' })
		}
		loading = false
	}
</script>

<Navbar>
	<div slot="top-right" class="flex space-x-2">
		<button
			onclick={updateProfile}
			class="p-2 rounded-full hover:bg-muted transition-colors duration-200"
			aria-label={$t('common.save')}
		>
			<Check class="w-6 h-6" />
		</button>
	</div>
	<div slot="title">{$t('account.title')}</div>
</Navbar>
<Content>
	<div>
		{#if $user}
		<Card.Root class="max-w-md mx-auto mt-8">
			<Card.Header>
				<Card.Title>{$t('account.title')}</Card.Title>
				<Card.Description>{$t('account.personalInfo')}</Card.Description>
			</Card.Header>
			<Card.Content>
<!--				<form on:submit|preventDefault={updateProfile} class="space-y-4">-->
					<div>
						<Label for="email">{$t('account.email')}</Label>
						<Input id="email" type="email" value={email} disabled />
					</div>
					<div>
						<Label for="firstName">{$t('account.firstName')}</Label>
						<Input id="firstName" type="text" bind:value={firstName} />
					</div>
					<div>
						<Label for="lastName">{$t('account.lastName')}</Label>
						<Input id="lastName" type="text" bind:value={lastName} />
					</div>
					<div>
						<Label for="bio">{$t('account.bio')}</Label>
						<Textarea id="bio" bind:value={bio} rows="3" class="resize-y" />
					</div>
					<!--
					<Button type="submit" disabled={loading}>
						{loading ? $t('account.updating') : $t('account.updateProfile')}
					</Button>
					-->
				<!--</form>-->
			</Card.Content>
			</Card.Root>
		{:else}
			<p>{$t('common.notLoggedIn')}</p>
		{/if}
	</div>
</Content>
