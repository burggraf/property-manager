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
	import { getMyInvites } from '$lib/inviteService' // Assuming this is the correct import path
	import type { Invite } from '$lib/types/invite'
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
			// Handle error (e.g., show error message to user)
		}
	}

	function toggleDialog() {
		isOpen = !isOpen
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
				<p class="text-center text-muted-foreground">{$t('notifications.noInvites')}</p>
			{:else}
				{#each invites as invite}
					<div class="flex justify-start items-center gap-2 w-full p-2 border rounded-md">
						<Bell class="h-4 w-4" />
						<div>
							<p class="text-sm font-medium">
								{invite?.metadata?.org_title || $t('notifications.newInvite')}
							</p>
							<p class="text-xs text-muted-foreground">
								expires {invite?.created_at ? new Date(invite.expires_at).toLocaleString() : ''}
							</p>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</DialogContent>
</Dialog>
