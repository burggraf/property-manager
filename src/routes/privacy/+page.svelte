<script lang="ts">
	import { t } from '$lib/i18n'
	import { Button } from '$lib/components/ui/button'

	function goBack() {
		history.back()
	}
</script>

<svelte:head>
	<title>{$t('privacy.pageTitle')}</title>
	<meta name="description" content={$t('privacy.metaDescription')} />
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<Button variant="outline" class="mb-6" onclick={goBack}>
		{$t('common.backButton')}
	</Button>

	<h1 class="text-3xl font-bold mb-6">{$t('privacy.title')}</h1>

	<section class="mb-8">
		<h2 class="text-2xl font-semibold mb-4">{$t('privacy.sections.introduction.title')}</h2>
		<p>{$t('privacy.sections.introduction.content')}</p>
	</section>

	<section class="mb-8">
		<h2 class="text-2xl font-semibold mb-4">
			{$t('privacy.sections.informationCollection.title')}
		</h2>
		<p>{$t('privacy.sections.informationCollection.content')}</p>
	</section>

	<section class="mb-8">
		<h2 class="text-2xl font-semibold mb-4">{$t('privacy.sections.useOfInformation.title')}</h2>
		<p>{$t('privacy.sections.useOfInformation.content')}</p>
	</section>

	<section class="mb-8">
		<h2 class="text-2xl font-semibold mb-4">{$t('privacy.sections.dataProtection.title')}</h2>
		<p>{$t('privacy.sections.dataProtection.content')}</p>
	</section>

	<section class="mb-8">
		<h2 class="text-2xl font-semibold mb-4">{$t('privacy.sections.cookies.title')}</h2>
		<p>{$t('privacy.sections.cookies.content')}</p>
	</section>

	<section class="mb-8">
		<h2 class="text-2xl font-semibold mb-4">{$t('privacy.sections.thirdPartyLinks.title')}</h2>
		<p>{$t('privacy.sections.thirdPartyLinks.content')}</p>
	</section>

	<section class="mb-8">
		<h2 class="text-2xl font-semibold mb-4">{$t('privacy.sections.changes.title')}</h2>
		<p>{$t('privacy.sections.changes.content')}</p>
	</section>

	<p class="text-sm text-gray-600 mt-8">{$t('privacy.lastUpdated')}</p>
</div>
