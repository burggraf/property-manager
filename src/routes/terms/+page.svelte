<script lang="ts">
	import { t } from '$lib/i18n'
	import { goto } from '$app/navigation'
	import { Button } from '$lib/components/ui/button'

	function goBack() {
		// This will navigate to the previous page in the browser's history
		history.back()
	}
</script>

<svelte:head>
	<title>{$t('terms.pageTitle')}</title>
	<meta name="description" content={$t('terms.metaDescription')} />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<Button variant="outline" class="mb-6" onclick={goBack}>
		{$t('common.backButton')}
	</Button>

	<h1 class="text-3xl font-bold mb-6">{$t('terms.title')}</h1>

	<section class="mb-8">
		<h2 class="text-2xl font-semibold mb-4">{$t('terms.sections.acceptance.title')}</h2>
		<p>{$t('terms.sections.acceptance.content')}</p>
	</section>

	<section class="mb-8">
		<h2 class="text-2xl font-semibold mb-4">{$t('terms.sections.useOfService.title')}</h2>
		<p>{$t('terms.sections.useOfService.content')}</p>
	</section>

	<section class="mb-8">
		<h2 class="text-2xl font-semibold mb-4">{$t('terms.sections.privacy.title')}</h2>
		<p>{$t('terms.sections.privacy.content')}</p>
	</section>

	<section class="mb-8">
		<h2 class="text-2xl font-semibold mb-4">{$t('terms.sections.termination.title')}</h2>
		<p>{$t('terms.sections.termination.content')}</p>
	</section>

	<section class="mb-8">
		<h2 class="text-2xl font-semibold mb-4">{$t('terms.sections.changes.title')}</h2>
		<p>{$t('terms.sections.changes.content')}</p>
	</section>

	<p class="text-sm text-gray-600 mt-8">{$t('terms.lastUpdated')}</p>
</div>
