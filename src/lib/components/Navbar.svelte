<!-- svelte-ignore slot_element_deprecated -->
<script lang="ts">
    import { Menu } from 'lucide-svelte';
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import Sidebar from '$lib/components/Sidebar.svelte';

    let sheetOpen = $state(false);

    function closeSheet() {
        sheetOpen = false;
    }
    const root = document.documentElement
	const styles = getComputedStyle(root)

	let hh = $state(styles.getPropertyValue('--header-height').trim())

	$effect(() => {
		const updateInsets = () => {
			hh = styles.getPropertyValue('--header-height').trim()
		}

		// Update initially
		updateInsets()
		setTimeout(updateInsets, 500);
		setTimeout(updateInsets, 1000);
		setTimeout(updateInsets, 3000);

		// Set up a MutationObserver to watch for changes in the root element's style
		const observer = new MutationObserver(updateInsets)
		observer.observe(root, { attributes: true, attributeFilter: ['style'] })

		// Clean up the observer when the component is destroyed
		return () => observer.disconnect()
	})
// pb-[calc(var(--safe-area-inset-top))]  
</script>

<header class="safe-area-top bg-background header-height fixed top-0 left-0 right-0 z-30 border-b">
    <div class="container mx-auto px-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
            <Sheet.Root bind:open={sheetOpen}>
                <Sheet.Trigger asChild let:builder>
                    <Button builders={[builder]} size="icon" variant="ghost">
                        <Menu class="h-5 w-5" />
                        <span class="sr-only">Toggle Menu</span>
                    </Button>
                </Sheet.Trigger>
                <Sheet.Content side="left" class="w-[300px] flex flex-col">
                    <Sidebar {closeSheet} />
                </Sheet.Content>
            </Sheet.Root>
            <slot name="top-left" />
        </div>

        <div class="flex-1 flex justify-center">
            <slot name="title" />
        </div>

        <div class="flex items-center">
            <slot name="top-right" />
        </div>
    </div>
</header>
