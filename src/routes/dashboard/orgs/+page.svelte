<script lang="ts">
	import { supabase, updateUser, currentOrgId, user } from '$lib/backend'
	import { t } from '$lib/i18n'
	import { showToast } from '$lib/utils/toast'
	import Navbar from '$lib/components/Navbar.svelte'
	import Content from '$lib/components/Content.svelte'
	import StatusBar from '$lib/components/StatusBar.svelte'
	import GenericList from '$lib/components/GenericList.svelte'
	import { Plus } from 'lucide-svelte'

	import type { PageData } from './$types'
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'

	let { data } = $props<{ data: PageData }>()

	let orgs = $state(data.orgs)
	let currentOrg = $state(null)

	onMount(() => {
		const unsubscribe = currentOrgId.subscribe((id) => {
			if (id) {
				currentOrg = orgs.find((org) => org.id === id) || null
			} else {
				currentOrg = null
			}
		})

		return unsubscribe
	})

	async function handleOrgClick(org: Org) {
		try {
			await setCurrentOrg(org)
			await goto(`/dashboard/orgs/${org.id}`)
		} catch (error) {
			console.error('Error handling org click:', error)
			showToast($t('org.navigationError'), { type: 'error' })
		}
	}

	async function setCurrentOrg(org: Org) {
		try {
			const { data, error } = await updateUser({
				data: { currentOrgId: org.id },
			})

			if (error) throw error

			currentOrgId.set(org.id)

			showToast($t('org.currentOrgUpdated'), { type: 'success' })
		} catch (error) {
			console.error('Error setting current org:', error)
			showToast($t('org.currentOrgUpdateError'), { type: 'error' })
			throw error
		}
	}

	async function handleNewOrgClick() {
		await goto('/dashboard/orgs/new')
	}

	const headers = [{ key: 'title', label: 'orgs.title', sortable: true }]
</script>

<Navbar>
	<div slot="title">{$t('org.listTitle')}</div>
	<div slot="top-right">
		<button
			onclick={handleNewOrgClick}
			class="p-2 rounded-full hover:bg-muted transition-colors duration-200"
			aria-label={$t('org.addNew')}
		>
			<Plus class="w-6 h-6" />
		</button>
	</div>
</Navbar>

<Content>
	<div class="container mx-auto p-4">
		{#if $user}
			<div class="space-y-6">
				<!-- Current Org display -->
				<div class="bg-secondary p-4 rounded-lg mb-4">
					<h2 class="text-lg font-semibold mb-2">{$t('org.currentOrg')}</h2>
					{#if currentOrg}
						<p>{currentOrg.title}</p>
					{:else}
						<p class="text-gray-500">{$t('org.noCurrentOrg')}</p>
					{/if}
				</div>

				<GenericList data={orgs} {headers} onRowClick={handleOrgClick} />
			</div>
		{:else}
			<p class="pt-8 text-center text-lg text-gray-500">{$t('common.notLoggedIn')}</p>
		{/if}
	</div>
</Content>

<StatusBar />
