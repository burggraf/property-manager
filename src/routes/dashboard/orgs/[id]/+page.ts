import type { Org } from '$lib/types/org';
import type { PageLoad } from './$types';
import { getOrgById, getMyRoleInOrg } from '$lib/orgService.svelte';

export const load: PageLoad = async ({ params }) => {
  if (params.id === 'new') {
    return {
      org: null
    }
  }
  const { data, error } = await getOrgById(params.id)
  const { data: roleData, error: roleError } = await getMyRoleInOrg(params.id)
  return {
    org: data as Org,
    role: roleData,
    error: error?.message || null
  };
};
