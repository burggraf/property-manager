import type { Org } from '$lib/types/org';
import type { PageLoad } from './$types';
import { getOrgById } from '$lib/orgService';

export const load: PageLoad = async ({ params }) => {
  const { data, error } = await getOrgById(params.id)

  console.log('getOrgById: data, error: ', data, error);
  return {
    org: data as Org,
    error: error?.message || null
  };
};
