import type { Contact } from '$lib/types/contact';
import type { PageLoad } from './$types';
import { fetchOrgs } from '$lib/orgService.svelte';

import { supabase } from '$lib/supabase';
export const load: PageLoad = async () => {

  // const { data, error } = await getAllOrgs();
  const { data, error } = await fetchOrgs('title', 'asc');
  return {
    orgs: data as any[] || [],
    error: error?.message || null
  };
};
