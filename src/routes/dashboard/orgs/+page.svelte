<script lang="ts">
  import { supabase } from '$lib/backend';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { t } from '$lib/i18n';
  import { showToast } from '$lib/utils/toast'
  import Navbar from '$lib/components/Navbar.svelte';
 import Content from '$lib/components/Content.svelte';
  import StatusBar from '$lib/components/StatusBar.svelte';

  let title = '';
  let isLoading = false;

  import { user } from '$lib/backend';
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
</script>
<Navbar>
    <div slot="title">{$t('org.createTitle')}</div>
</Navbar>
<Content>
<div class="container mx-auto p-4">  
  {#if $user}
  <form on:submit|preventDefault={createOrg} class="mt-4 space-y-4 flex flex-col items-center">
    <div class="w-full max-w-[200px] flex flex-col items-center">
      <label for="title" class="pl-2 w-full pb-2 block text-sm font-medium text-gray-700 text-left">
        {$t('org.nameLabel')}
      </label>
      <Input
        type="text"
        id="title"
        bind:value={title}
        placeholder={$t('org.namePlaceholder')}
        required
        class="w-full"
      />
    </div>
    
    <Button type="submit" disabled={isLoading} class="w-full max-w-[200px]">
      {#if isLoading}
        {$t('common.loading')}
      {:else}
        {$t('org.createButton')}
      {/if}
    </Button>
    </form>
    {:else}
      <p class="pt-8 text-center text-lg text-gray-500">{$t('common.notLoggedIn')}</p>
  {/if}
</div>
</Content>
<StatusBar />
