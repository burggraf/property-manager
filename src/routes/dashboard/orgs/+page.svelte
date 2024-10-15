<script lang="ts">
  import { supabase } from '$lib/backend';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { t } from '$lib/i18n';
  import { showToast } from '$lib/utils/toast'

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

<div class="container mx-auto p-4 text-center">
  <h1 class="text-2xl font-bold mb-4">{$t('org.createTitle')}</h1>
  
  {#if $user}
  <form on:submit|preventDefault={createOrg} class="space-y-4 flex flex-col items-center">
    <div class="w-full max-w-[200px]">
      <label for="title" class="pb-2 block text-sm font-medium text-gray-700 text-center">
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
    
    <Button type="submit" disabled={isLoading}>
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
