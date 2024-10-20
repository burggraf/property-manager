<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogTrigger,
	} from '$lib/components/ui/dialog'
	import { Bell } from 'lucide-svelte'
	import { t } from '$lib/i18n'
	import { getMyInvites, deleteInvite, acceptInvite } from '$lib/inviteService'
	import type { Invite } from '$lib/types/invite'
	import { showToast } from '$lib/utils/toast'

	let isOpen = $state(false)
	let invites: Invite[] = $state([])

	$effect(() => {
		if (isOpen) {
			fetchInvites()
		}
	})

	async function fetchInvites() {
		try {
			invites = (await getMyInvites()).data || []
			console.log('invites', invites)
		} catch (error) {
			console.error('Failed to fetch invites:', error)
		}
	}

	function toggleDialog() {
		isOpen = !isOpen
	}

	async function handleJoin(invite: Invite) {
		console.log('Joining:', invite)
		const { error } = await acceptInvite(invite.id)
		if (error) {
			console.error('Error accepting invite:', error)
			showToast($t('invites.acceptError'), { type: 'error' })
		} else {
			showToast($t('invites.acceptSuccess'), { type: 'success' })
			invites = invites.filter((i) => i.id !== invite.id)
		}
	}

	async function handleReject(id: string) {
		const confirmMessage = $t('notifications.confirmReject')

		if (confirm(confirmMessage)) {
			console.log('Rejecting:', id)
			const { error } = await deleteInvite(id)
			if (error) {
				console.error('Error deleting invite:', error)
				showToast($t('invites.deleteError'), { type: 'error' })
			} else {
				console.log('Invite deleted successfully')
				showToast($t('invites.deleteSuccess'), { type: 'success' })
				await fetchInvites()
			}
		}
	}
</script>

<Dialog bind:open={isOpen}>
	<DialogTrigger asChild>
		<Button variant="ghost" size="icon" class="w-12 h-12 p-0" on:click={toggleDialog}>
			<Bell class="h-6 w-6" />
			<span class="sr-only">{$t('notifications.open')}</span>
		</Button>
	</DialogTrigger>
	<DialogContent class="sm:max-w-[425px]">
		<DialogHeader>
			<DialogTitle>{$t('notifications.title')}</DialogTitle>
		</DialogHeader>
		<div class="grid gap-4 py-4">
			{#if invites.length === 0}
				<p class="text-center text-muted-foreground">{$t('notifications.noNotifications')}</p>
			{:else}
				{#each invites as invite}
					<div class="flex flex-col w-full p-4 border rounded-md">
						<p class="text-sm font-medium mb-2">
							{$t('notifications.inviteMessage')}
							{invite?.metadata?.org_title || $t('notifications.defaultOrgTitle')} as {invite.user_role}.
						</p>
						<div class="flex w-full gap-2">
							<Button
								variant="outline"
								class="flex-1 bg-green-500 hover:bg-green-600 text-white"
								on:click={() => handleJoin(invite)}
							>
								{$t('notifications.join')}
							</Button>
							<Button
								variant="outline"
								class="flex-1 bg-red-500 hover:bg-red-600 text-white"
								on:click={() => handleReject(invite.id)}
							>
								{$t('notifications.reject')}
							</Button>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</DialogContent>
</Dialog>
