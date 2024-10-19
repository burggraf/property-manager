<script lang="ts">
	import { MoreVertical } from 'lucide-svelte'
	import { Button } from '$lib/components/ui/button'
	import { cn } from '$lib/utils'

	interface Action {
		icon: typeof MoreVertical
		title: string
		action: () => void
		disabled?: boolean
	}

	let { actions } = $props<{ actions: Action[] }>()
	let isOpen = $state(false)
	let dropdownRef = $state<HTMLDivElement | null>(null)

	function toggleDropdown() {
		isOpen = !isOpen
	}

	function handleAction(action: () => void, disabled: boolean) {
		if (!disabled) {
			action()
			isOpen = false
		}
	}

	function clickOutside(node: HTMLElement) {
		const handleClick = (event: MouseEvent) => {
			if (node && !node.contains(event.target as Node) && isOpen) {
				isOpen = false
			}
		}

		document.addEventListener('click', handleClick, true)

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true)
			},
		}
	}
</script>

<div class="relative" use:clickOutside>
	<Button variant="ghost" size="icon" class="h-9 w-9 p-0" onclick={toggleDropdown}>
		<MoreVertical class="h-5 w-5" />
		<span class="sr-only">Open menu</span>
	</Button>

	{#if isOpen}
		<div
			bind:this={dropdownRef}
			class={cn(
				'absolute right-0 mt-2 w-48 rounded-md shadow-lg',
				'bg-background border border-border',
				'dark:bg-background dark:border-border',
				'z-10'
			)}
		>
			<div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
				{#each actions as { icon: Icon, title, action, disabled }}
					<button
						class={cn(
							'flex items-center w-full px-4 py-2 text-sm',
							'text-foreground hover:bg-muted',
							'dark:text-foreground dark:hover:bg-muted',
							disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
						)}
						role="menuitem"
						onclick={() => handleAction(action, disabled)}
						{disabled}
					>
						<Icon class={cn('mr-2 h-4 w-4', disabled && 'opacity-50')} />
						<span>{title}</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
