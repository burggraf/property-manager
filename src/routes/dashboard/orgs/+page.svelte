<script lang="ts">
  import { supabase } from '$lib/backend';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { t } from '$lib/i18n';
  import { showToast } from '$lib/utils/toast'
  import Navbar from '$lib/components/Navbar.svelte';
  import Content from '$lib/components/Content.svelte';
  import StatusBar from '$lib/components/StatusBar.svelte';
  import GenericList from '$lib/components/GenericList.svelte';

  import { user } from '$lib/backend';
  import type { PageData } from './$types'

  let { data } = $props<{ data: PageData }>();

  let title = $state('');
  let isLoading = $state(false);

  async function createOrg() {
    if (!$user) {
      console.error('User not logged in -showing toast');
      showToast($t('common.notLoggedIn'), { type: 'error' })
      return
    }
    isLoading = true;
    try {
      const { data, error } = await supabase.functions.invoke('org_create', {
        body: { title },
      });

      if (error) throw error;

      showToast($t('org.createSuccess'), { type: 'success' })

      // Reset the form
      title = '';
    } catch (error) {
      console.error('Error creating org:', error);
      showToast($t('org.createError'), { type: 'error' })
    } finally {
      isLoading = false;
    }
  }

  function handleOrgClick(org) {
    console.log('Clicked on org:', org);
  }

  const headers = [
    { key: 'title', label: 'orgs.title', sortable: true },
  ];
</script>

<Navbar>
    <div slot="title">{$t('org.listTitle')}</div>
</Navbar>

<Content>
  <div class="container mx-auto p-4">  
    {#if $user}
      <div class="space-y-6">
        <GenericList
          data={data.orgs}
          headers={headers}
          onRowClick={handleOrgClick}
        />

        <div class="border-t pt-6">
          <h2 class="text-lg font-semibold mb-4">{$t('org.addNewTitle')}</h2>
          <form on:submit|preventDefault={createOrg} class="flex items-end gap-4">
            <div class="flex-grow">
              <label for="orgTitle" class="block text-sm font-medium text-gray-700 mb-1">
                {$t('org.titleLabel')}
              </label>
              <Input
                id="orgTitle"
                type="text"
                bind:value={title}
                placeholder={$t('org.titlePlaceholder')}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? $t('common.loading') : $t('org.addButton')}
            </Button>
          </form>
        </div>
      </div>
    {:else}
      <p class="pt-8 text-center text-lg text-gray-500">{$t('common.notLoggedIn')}</p>
    {/if}
  </div>
</Content>

<StatusBar />
