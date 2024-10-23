import type { Contact } from '$lib/types/contact';
import type { PageLoad } from './$types';
import { getAllContacts } from '$lib/contactService.svelte';

export const load: PageLoad = async () => {
  const { data, error } = await getAllContacts();

  return {
    contacts: data as Contact[] || [],
    error: error?.message || null
  };
};
