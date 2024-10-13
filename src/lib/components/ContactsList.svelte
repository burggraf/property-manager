<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from "$lib/components/ui/button";
  import { ChevronUp, ChevronDown } from 'lucide-svelte';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "$lib/components/ui/table";
  import type { Contact } from '../types/contact';
  import { createSortHandler, type SortState } from '$lib/utils/sorting';
  import { t } from '$lib/i18n';
  import { fetchContacts } from '$lib/contactService';
	import { user } from '$lib/backend';

  let contacts = $state<Contact[]>([]);
  let sortState = $state<SortState>({ column: 'lastname', direction: 'asc' });

  // Remove the existing $effect
  // $effect(() => {
  //   loadContacts();
  // });

  // Add a new $effect that depends on $user
  $effect(() => {
    // This will run whenever $user changes
    if ($user) {
      loadContacts();
    } else {
      // Clear contacts if user is not logged in
      contacts = [];
    }
  });

  async function loadContacts() {
    try {
      const { data, error } = await fetchContacts(sortState.column, sortState.direction);
      if (error) {
        console.error('Error loading contacts:', error);
        contacts = [];
      } else {
        contacts = data;
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      // Handle error (e.g., show error message to user)
    }
  }

  const handleSort = createSortHandler(sortState, loadContacts);

  function handleContactClick(id: string) {
    goto(`/dashboard/contacts/${id}`);
  }

  function getSortIcon(column: string) {
    if (sortState.column === column) {
      return sortState.direction === 'asc' ? ChevronUp : ChevronDown;
    }
    return null;
  }
</script>

<!--<div class="container mx-auto py-0 px-1">-->
<div class="mx-auto px-1 pt-4">
    <Table>
    <TableHeader>
      <TableRow>
        <TableHead>
          <Button variant="ghost" class="justify-start w-full px-2" onclick={() => handleSort('firstname')}>
            <span class="flex items-center">
              {$t('contacts.firstname')}
              {#key getSortIcon('firstname')}
                {#if getSortIcon('firstname')}
                  {@const Icon = getSortIcon('firstname')}
                  <Icon class="ml-1 h-4 w-4" />
                {/if}
              {/key}
            </span>
          </Button>
        </TableHead>
        <TableHead>
          <Button variant="ghost" class="justify-start w-full px-2" onclick={() => handleSort('lastname')}>
            <span class="flex items-center">
              {$t('contacts.lastname')}
              {#key getSortIcon('lastname')}
                {#if getSortIcon('lastname')}
                  {@const Icon = getSortIcon('lastname')}
                  <Icon class="ml-1 h-4 w-4" />
                {/if}
              {/key}
            </span>
          </Button>
        </TableHead>
        <TableHead>
          <Button variant="ghost" class="justify-start w-full px-2" onclick={() => handleSort('email')}>
            <span class="flex items-center">
              {$t('contacts.email')}
              {#key getSortIcon('email')}
                {#if getSortIcon('email')}
                  {@const Icon = getSortIcon('email')}
                  <Icon class="ml-1 h-4 w-4" />
                {/if}
              {/key}
            </span>
          </Button>
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each contacts as contact (contact.id)}
        <TableRow onclick={() => handleContactClick(contact.id)} class="cursor-pointer">
          <TableCell>{contact.firstname}</TableCell>
          <TableCell>{contact.lastname}</TableCell>
          <TableCell>{contact.email}</TableCell>
        </TableRow>
      {/each}
    </TableBody>
  </Table>

  {#if contacts.length === 0}
    <p class="text-center text-gray-500 mt-4">{$t('contacts.noContacts')}</p>
  {/if}
</div>
