<script lang="ts">
	import { goto } from '$app/navigation'
	import { t } from '$lib/i18n'
	import { cn } from '$lib/utils'
	import { Check, X, Trash2 } from 'lucide-svelte'
	import { page } from '$app/stores'
	import { showToast } from '$lib/utils/toast'
	import { supabase, user } from '$lib/backend'
	let { data } = $props()
	let orgDetail = $state(data.org?.data || { title: '' })
	let isNewOrg = $derived($page.params.id === 'new')
	let isLoading = $state(false)
	import Navbar from '$lib/components/Navbar.svelte'
	import Content from '$lib/components/Content.svelte'
	import StatusBar from '$lib/components/StatusBar.svelte'
	import { Input } from '$lib/components/ui/input'

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
