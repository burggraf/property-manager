<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import { t } from '$lib/i18n'
</script>

<div class="mt-auto px-2 py-4 border-t">
	<div class="flex items-center justify-between mb-2">
		<div>
			<p class="text-xs font-medium">{$t('sidebar.currentPlan')}</p>
			<p class="text-xs text-muted-foreground">Pro</p>
		</div>
		<Button size="sm" class="text-xs">{$t('sidebar.upgrade')}</Button>
	</div>
	<div class="flex justify-between text-xs text-muted-foreground">
		<a href="/terms">{$t('sidebar.termsOfService')}</a>
		<a href="/privacy">{$t('sidebar.privacyPolicy')}</a>
	</div>
</div>
