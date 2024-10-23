<script lang="ts">
	import { page } from '$app/stores'
	import * as Accordion from '$lib/components/ui/accordion/index.js'

	interface NavigationItem {
		label: string
		href: string
	}

	interface NavigationCategory {
		category: string
		icon: any
		items: NavigationItem[]
	}

	let { sidebarNavigation, closeSheet } = $props<{
		sidebarNavigation: NavigationCategory[]
		closeSheet: () => void
	}>()

	function handleNavClick(event: Event) {
		setTimeout(() => closeSheet(), 100)
	}

	//$effect(() => {
	//	console.log('SidebarMenu - sidebarNavigation:', sidebarNavigation)
	//})
</script>

<nav class="flex-1 py-2">
	{#if sidebarNavigation().length > 0}
		<Accordion.Root type="single" collapsible>
			{#each sidebarNavigation() as { category, icon: Icon, items }, index}
				{#if items.length > 0}
					<Accordion.Item value={category.toLowerCase()} class="border-none">
						<Accordion.Trigger
							class="flex w-full items-center justify-between px-2 py-2 text-sm hover:bg-muted/50 data-[state=open]:bg-muted no-underline"
						>
							<div class="flex items-center">
								<Icon class="mr-2 h-4 w-4" />
								{category}
							</div>
						</Accordion.Trigger>
						<Accordion.Content class="py-1">
							{#each items as { label, href }}
								<a
									{href}
									class="block py-2 px-6 text-sm hover:bg-muted/50 no-underline"
									class:bg-muted={$page.url.pathname === href}
									on:click={handleNavClick}
								>
									{label}
								</a>
							{/each}
						</Accordion.Content>
					</Accordion.Item>
				{/if}
			{/each}
		</Accordion.Root>
	{:else}
		<p>No navigation items available.</p>
	{/if}
</nav>
