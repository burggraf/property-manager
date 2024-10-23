import { getItemById, deleteItem, saveItem, getList, getSession } from './backend.svelte.ts';
import { supabase } from './backend.svelte.ts';
import type { Org } from '$lib/types/org.ts';   

export const getAllOrgs = async () => {
    return fetchOrgs('title', 'asc');
}

export async function fetchOrgs(column: string, direction: 'asc' | 'desc') {
    const { data, error } = await getList('orgs', 1, 50, column, direction);
    return { data, error };
}

export const getOrgById = async (id: string) => {
    try {
        const data = await getItemById('orgs', id);
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export const getMyRoleInOrg = async (orgId: string) => {
    const { data: sessionData, error: sessionError } = await getSession();
    const { data, error } = await supabase
        .from('orgs_users')
        .select('user_role')
        .eq('orgid', orgId)
        .eq('userid', sessionData?.session?.user?.id)
        .limit(1)
        .single();
    return { data: data?.user_role, error };
}

