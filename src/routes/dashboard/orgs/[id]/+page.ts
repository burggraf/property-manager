import type { Org } from '$lib/types/org';
import type { PageLoad } from './$types';
import { getOrgById, getMyRoleInOrg } from '$lib/orgService';

export const load: PageLoad = async ({ params }) => {
  if (params.id === 'new') {
    return {
      org: null
    }
  }
  const { data, error } = await getOrgById(params.id)
  console.log('params.id: ', params.id )
  const { data: roleData, error: roleError } = await getMyRoleInOrg(params.id)
  console.log('roleData: ', roleData)
  console.log('roleError: ', roleError)
  return {
    org: data as Org,
    role: roleData,
    error: error?.message || null
  };
};
