<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import { t } from '$lib/i18n'

	import Navbar from '$lib/components/Navbar.svelte';
	import Content from '$lib/components/Content.svelte';
	import StatusBar from '$lib/components/StatusBar.svelte';
	// Function to handle language change
</script>
<Navbar>
	<div slot="title">Dashboard</div>
</Navbar>
<Content>
	<div class="lg:col-span-3">
		<Card.Root>
			<Card.Header>
				<Card.Title>{$t('dashboard.title')}</Card.Title>
				<Card.Description>
					{$t('dashboard.description')}
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<p>{$t('dashboard.content')}</p>
			</Card.Content>
			<Card.Footer>
				<Button>{$t('dashboard.button')}</Button>
			</Card.Footer>
		</Card.Root>
	</div>

	<!--
<div>
  <select value={$locale} on:change={handleLanguageChange}>
    <option value="en">English</option>
    <option value="es">Español</option>
  </select>
</div>
-->
</Content>
<StatusBar />