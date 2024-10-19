import type { Org } from '$lib/types/org';
import type { PageLoad } from './$types';
import { getOrgById } from '$lib/orgService';

export const load: PageLoad = async ({ params }) => {
  if (params.id === 'new') {
    return {
      org: null
    }
  }
  const { data, error } = await getOrgById(params.id)

  return {
    org: data as Org,
    error: error?.message || null
  };
};
