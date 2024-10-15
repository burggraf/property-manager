import type { Contact } from '$lib/types/contact';
import type { PageLoad } from './$types';
import { fetchOrgs } from '$lib/orgService';

import { supabase } from '$lib/supabase';
import { user, getSession } from '$lib/backend';
let $user: any = null;
export const load: PageLoad = async () => {

  // const { data, error } = await getAllOrgs();
  const { data, error } = await fetchOrgs('title', 'asc');
  console.log('fetchOrgs: data, error: ', data, error);
  return {
    orgs: data as any[] || [],
    error: error?.message || null
  };
};
