<script lang="ts">
  // import { goto } from '$app/navigation';
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
  import { t } from '$lib/i18n';

  interface Header {
    key: string;
    label: string;
    sortable: boolean;
  }

  interface Props {
    data: any[];
    headers: Header[];
    onRowClick?: (item: any) => void;
    onSort?: (column: string, direction: 'asc' | 'desc') => Promise<void>;
  }

  let { data, headers, onRowClick, onSort } = $props<Props>();

  let sortColumn = $state('');
  let sortDirection = $state<'asc' | 'desc'>('asc');

  let sortedData = $derived(onSort ? data : sortData(data, sortColumn, sortDirection));

  async function handleSort(column: string) {
    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = 'asc';
    }

    if (onSort) {
      await onSort(sortColumn, sortDirection);
    }
  }

  function sortData(data: any[], column: string, direction: 'asc' | 'desc') {
    if (!column) return data;
    
    return [...data].sort((a, b) => {
      if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  function getSortIcon(column: string) {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? ChevronUp : ChevronDown;
    }
    return null;
  }
</script>

<div class="generic-list-container">
  <div class="table-header pt-4">
    <Table>
      <TableHeader>
        <TableRow>
          {#each headers as header}
            <TableHead>
              {#if header.sortable}
                <Button variant="ghost" class="justify-start w-full px-2" on:click={() => handleSort(header.key)}>
                  <span class="flex items-center">
                    {$t(header.label)}
                    {#key getSortIcon(header.key)}
                      {#if getSortIcon(header.key)}
                        {@const Icon = getSortIcon(header.key)}
                        <Icon class="ml-1 h-4 w-4" />
                      {/if}
                    {/key}
                  </span>
                </Button>
              {:else}
                <span class="px-2">{$t(header.label)}</span>
              {/if}
            </TableHead>
          {/each}
        </TableRow>
      </TableHeader>
    </Table>
  </div>
  <div class="table-body pt-6">
    <Table>
      <TableBody>
        {#each sortedData as item (item.id)}
          <TableRow on:click={() => onRowClick && onRowClick(item)} class="cursor-pointer">
            {#each headers as header}
              <TableCell>{item[header.key]}</TableCell>
            {/each}
          </TableRow>
        {/each}
      </TableBody>
    </Table>
    {#if sortedData.length === 0}
      <p class="text-center text-gray-500 mt-4">{$t('generic.noData')}</p>
    {/if}
  </div>
</div>

<style>
  .generic-list-container {
    position: relative;
    height: calc(100vh - 100px); /* Adjust based on your layout */
    overflow: hidden;
  }

  .table-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color: white; /* Adjust based on your theme */
    z-index: 10;
  }

  .table-body {
    position: absolute;
    top: 40px; /* Adjust based on your header height */
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
    padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 3.5rem);
  }

  /* Ensure consistent widths between header and body */
  :global(.generic-list-container table) {
    width: 100%;
    table-layout: fixed;
  }

  :global(.generic-list-container th),
  :global(.generic-list-container td) {
    width: calc(100% / var(--column-count)); /* Dynamically set based on number of columns */
  }
</style>
