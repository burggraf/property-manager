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

  import { user, getSession } from '$lib/backend';
  import { fetchOrgs } from '$lib/orgService';
  import type { PageData } from './$types'

  // Add this line to receive the organizations data from +page.ts
  let { data } = $props<{ data: PageData }>();

  let orgs: any[] = $state<any[]>([]);
  let currentSortColumn = $state('title');
  let currentSortDirection = $state<'asc' | 'desc'>('asc');


  let title = '';
  let isLoading = false;

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

  // Function to handle clicking on an organization
  function handleOrgClick(org) {
    // Implement the action when an org is clicked, e.g., navigate to org details
    console.log('Clicked on org:', org);
  }
  async function handleSort(column: string, direction: 'asc' | 'desc') {
    currentSortColumn = column;
    currentSortDirection = direction;
    await fetchOrgs(column, direction);
  }
  const headers = [
    { key: 'title', label: 'orgs.title', sortable: true },
  ];

</script>

<Navbar>
    <div slot="title">{$t('org.createTitle')}</div>
</Navbar>

<Content>
  <div class="container mx-auto p-4">  
    {#if $user}
    <GenericList
        data={data.orgs}
        headers={headers}
        onRowClick={handleOrgClick}
        onSort={handleSort}
        />
    {:else}
      <p class="pt-8 text-center text-lg text-gray-500">{$t('common.notLoggedIn')}</p>
    {/if}
  </div>
</Content>

<StatusBar />
