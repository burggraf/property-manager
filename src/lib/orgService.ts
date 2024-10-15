import { getItemById, deleteItem, saveItem, getList } from './backend';
import { user } from './backend';
let $user: any = null;
user.subscribe((u) => {
    $user = u;
    console.log('orgService: user: ', $user);
});

export const getOrgById = async (id: string) => {
    try {
        const data = await getItemById('orgs', id);
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export const getAllOrgs = async () => {
    return fetchOrgs('title', 'asc');
}

export async function fetchOrgs(column: string, direction: 'asc' | 'desc') {
    console.log('fetchOrgs, $user: ', $user);
    const { data, error } = await getList('orgs', 1, 50, column, direction);
    console.log('fetchOrgs: data, error: ', data, error);
    return { data, error };
}

