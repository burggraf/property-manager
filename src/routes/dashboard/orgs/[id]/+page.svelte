<script lang="ts">
	import { goto } from '$app/navigation'
	import { t } from '$lib/i18n'
	import { cn } from '$lib/utils'
	import { Check, X, Trash2, Mail, Plus, UserPlus } from 'lucide-svelte'
	import { page } from '$app/stores'
	import { showToast } from '$lib/utils/toast'
	import { supabase, setCurrentOrgId, updateUser, user } from '$lib/backend'
	import { Button } from '$lib/components/ui/button'
	let { data } = $props()
	let orgDetail = $state(data.org?.data || { title: '' })
	let user_role = $state(data.role || '')
	let isNewOrg = $derived($page.params.id === 'new')
	let isLoading = $state(false)
	let invites = $state<Invite[]>([])
	let showInviteForm = $state(false)
	let newInviteEmail = $state('')
	let emailError = $state('')
	let newInviteRole = $state('Member') // Default role
	let roleError = $state('')
	import Navbar from '$lib/components/Navbar.svelte'
	import Content from '$lib/components/Content.svelte'
	import StatusBar from '$lib/components/StatusBar.svelte'
	import { Input } from '$lib/components/ui/input'
	import type { Invite } from '$lib/types/invite'
	import {
		getAllInvites,
		getInviteById,
		updateInvite,
		deleteInvite,
		createInvite,
	} from '$lib/inviteService'
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue,
	} from '$lib/components/ui/select'

	async function handleSave() {
		if (!orgDetail.title) {
			showToast($t('orgDetail.titleMissing'), { type: 'error' })
			return
		}

		isLoading = true
		try {
			if (isNewOrg) {
				const { data: newOrg, error } = await supabase.functions.invoke('org_create', {
					body: { title: orgDetail.title },
				})

				if (error) throw error
				// Set the newly created org as the current org
				setCurrentOrgId(newOrg.org.id)
				const { data: updateUserData, error: updateUserError } = await updateUser({
					data: { currentOrgId: newOrg.org.id },
				})

				showToast($t('org.createSuccess'), { type: 'success' })
				goto('/dashboard/orgs') // Navigate back to org list after successful creation
			} else {
				const { data, error } = await supabase.functions.invoke('org_update', {
					body: { id: orgDetail.id, title: orgDetail.title },
				})

				if (error) throw error

				showToast($t('orgDetail.saveSuccess'), { type: 'success' })
				goto('/dashboard/orgs')
			}
		} catch (error) {
			console.error('Error saving organization:', error)
			showToast(isNewOrg ? $t('org.createError') : $t('orgDetail.saveError'), { type: 'error' })
		} finally {
			isLoading = false
		}
	}

	async function handleDelete() {
		if (confirm($t('orgDetail.deleteConfirmation'))) {
			const { data, error } = await supabase.functions.invoke('org_delete', {
				body: { id: orgDetail.id },
			})
			if (error) {
				console.error('Error deleting organization:', error)
				showToast($t('orgDetail.deleteError'), { type: 'error' })
			} else {
				showToast($t('orgDetail.deleteSuccess'), { type: 'success' })
				goto('/dashboard/orgs')
			}
		}
	}

	function handleBackToOrgs() {
		goto('/dashboard/orgs')
	}

	function handleSubmit(event: Event) {
		event.preventDefault()
		handleSave()
	}

	$effect(() => {
		if (!isNewOrg) {
			loadInvites()
		}
	})

	async function loadInvites() {
		const { data, error } = await getAllInvites(orgDetail.id)
		if (error) {
			console.error('Error loading invites:', error)
			showToast($t('invites.loadError'), { type: 'error' })
		} else {
			invites = data
		}
	}

	function validateEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return emailRegex.test(email)
	}

	async function handleCreateInvite() {
		if (!newInviteEmail) {
			emailError = $t('invites.emailRequired')
			return
		}

		if (!validateEmail(newInviteEmail)) {
			emailError = $t('invites.invalidEmail')
			return
		}

		if (!newInviteRole) {
			roleError = $t('invites.roleRequired')
			return
		}

		emailError = ''
		roleError = ''

		console.log('Creating invite with role:', newInviteRole) // Add this line for debugging

		const { data, error } = await createInvite({
			orgid: orgDetail.id,
			owner: $user?.id,
			email: newInviteEmail,
			user_role: newInviteRole,
			metadata: {
				org_title: orgDetail.title,
			},
		})

		if (error) {
			console.error('Error creating invite:', error)
			showToast($t('invites.createError'), { type: 'error' })
		} else {
			showToast($t('invites.createSuccess'), { type: 'success' })
			newInviteEmail = ''
			newInviteRole = 'Member'
			showInviteForm = false
			await loadInvites()
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleString()
	}

	async function handleDeleteInvite(inviteId: string) {
		if (confirm($t('invites.deleteConfirmation'))) {
			const { error } = await deleteInvite(inviteId)
			if (error) {
				console.error('Error deleting invite:', error)
				showToast($t('invites.deleteError'), { type: 'error' })
			} else {
				showToast($t('invites.deleteSuccess'), { type: 'success' })
				await loadInvites()
			}
		}
	}
</script>

<Navbar>
	<div slot="top-right" class="flex space-x-2">
		<button
			onclick={handleBackToOrgs}
			class="p-2 rounded-full hover:bg-muted transition-colors duration-200"
			aria-label={$t('common.cancel')}
		>
			<X class="w-6 h-6" />
		</button>
		<button
			onclick={handleSave}
			class="p-2 rounded-full hover:bg-muted transition-colors duration-200"
			aria-label={$t('common.save')}
			disabled={isLoading}
		>
			<Check class="w-6 h-6" />
		</button>
	</div>
	<div slot="title">
		{isNewOrg ? $t('orgDetail.createNew') : $t('orgDetail.editOrg')}
	</div>
</Navbar>
<Content>
	<div class="pt-4 pb-4">
		<div class="max-w-2xl mx-auto mt-8 relative pb-16">
			<form class="space-y-4" onsubmit={handleSubmit}>
				<div class="w-full p-2 border rounded bg-background">
					<label for="title" class="block text-sm font-medium text-foreground"
						>{$t('orgDetail.title')}</label
					>
					<Input
						id="title"
						type="text"
						bind:value={orgDetail.title}
						placeholder={$t('org.titlePlaceholder')}
						required
					/>
				</div>
				<div class="w-full p-2 border rounded bg-background">
					<label for="role" class="block text-sm font-medium text-foreground">
						{$t('orgDetail.role')}
					</label>
					<div>x{user_role}x</div>
				</div>

				{#if !isNewOrg}
					<div class="w-full p-2 border rounded bg-background">
						<div class="flex justify-between items-center mb-2">
							<h2 class="text-lg font-semibold">{$t('invites.title')}</h2>
							{#if !showInviteForm}
								<Button onclick={() => (showInviteForm = true)} variant="outline" class="ml-auto">
									<UserPlus class="w-4 h-4 mr-2" />
									{$t('invites.inviteUser')}
								</Button>
							{/if}
						</div>
						<ul class="space-y-2">
							{#each invites as invite (invite.id)}
								<li class="flex justify-between items-center">
									<span>{invite.email}</span>
									<div class="flex items-center space-x-2">
										<span>{formatDate(invite.expires_at)}</span>
										<button
											type="button"
											onclick={() => handleDeleteInvite(invite.id)}
											class="p-1 rounded-full text-destructive hover:bg-muted transition-colors duration-200"
											aria-label={$t('invites.delete')}
										>
											<Trash2 class="w-4 h-4" />
										</button>
									</div>
								</li>
							{/each}
						</ul>
						{#if showInviteForm}
							<div class="mt-2 space-y-2">
								<div class="flex items-center space-x-2">
									<Input
										type="email"
										bind:value={newInviteEmail}
										placeholder={$t('invites.emailPlaceholder')}
										class={cn(emailError && 'border-destructive')}
									/>
									<Select
										onSelectedChange={(value) => {
											console.log('value is', value)
											console.log('newInviteRole is', newInviteRole)
											newInviteRole = value.value
										}}
									>
										<SelectTrigger class={cn('w-[180px]', roleError && 'border-destructive')}>
											<SelectValue placeholder={$t('invites.selectRole')}
												>{newInviteRole}</SelectValue
											>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Owner">{$t('invites.roleOwner')}</SelectItem>
											<SelectItem value="Member">{$t('invites.roleMember')}</SelectItem>
											<SelectItem value="Read-Only">{$t('invites.roleReadOnly')}</SelectItem>
										</SelectContent>
									</Select>
									<button
										type="button"
										onclick={() => {
											showInviteForm = false
											emailError = ''
											roleError = ''
										}}
										class="p-2 rounded-full hover:bg-muted transition-colors duration-200"
										aria-label={$t('common.cancel')}
									>
										<X class="w-5 h-5" />
									</button>
									<button
										type="button"
										onclick={handleCreateInvite}
										class="p-2 rounded-full hover:bg-muted transition-colors duration-200"
										aria-label={$t('common.save')}
									>
										<Check class="w-5 h-5" />
									</button>
								</div>
								{#if emailError}
									<p class="text-sm text-destructive">{emailError}</p>
								{/if}
								{#if roleError}
									<p class="text-sm text-destructive">{roleError}</p>
								{/if}
							</div>
						{/if}
					</div>
				{/if}

				{#if !isNewOrg}
					<div class="absolute bottom-0 right-0 mt-4">
						<button
							type="button"
							onclick={handleDelete}
							class="p-2 rounded-full text-destructive hover:bg-muted transition-colors duration-200"
							aria-label={$t('common.delete')}
						>
							<Trash2 class="w-6 h-6" />
						</button>
					</div>
				{/if}
			</form>
		</div>
	</div>
</Content>
<StatusBar />
