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

	let isOpen = $state(false)

	const dummyNotifications = [
		{ id: 1, message: 'New message received', time: '5 minutes ago' },
		{ id: 2, message: 'Your post was liked', time: '1 hour ago' },
		{ id: 3, message: 'New friend request', time: '2 hours ago' },
		{ id: 4, message: 'System update available', time: '1 day ago' },
	]

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
			{#each dummyNotifications as notification}
				<div class="flex justify-start items-center gap-2 w-full p-2 border rounded-md">
					<Bell class="h-4 w-4" />
					<div>
						<p class="text-sm font-medium">{notification.message}</p>
						<p class="text-xs text-muted-foreground">{notification.time}</p>
					</div>
				</div>
			{/each}
		</div>
	</DialogContent>
</Dialog>
