import { error } from "@sveltejs/kit";

import type { PageLoad } from "./$types";
import { getContactById } from "$lib/contactService.svelte";

export const load: PageLoad = async ({ params }) => {
  if (params.id === 'new') {
    return {
      contact: {
        firstname: '',
        lastname: '',
        email: '',
        notes: ''
      }
    };
  } 

  const { data, error: err } = await getContactById(params.id)

  if (err) {
    throw error(404, 'Contact not found');
  }
  return {
    contact: data?.data, error
  };
};
