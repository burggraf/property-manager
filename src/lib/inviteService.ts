import { getItemById, deleteItem, saveItem, getList } from './backend.ts';
import { user } from './backend.ts';
import type { Invite } from '$lib/types/invite.ts';

let $user: any = null;
user.subscribe((u) => {
    $user = u;
});

export const getInviteById = async (id: string) => {
    try {
        const data = await getItemById('orgs_invites', id);
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export const getAllInvites = async () => {
    return fetchInvites('created_at', 'desc');
}

export async function fetchInvites(column: string, direction: 'asc' | 'desc') {
    const { data, error } = await getList('orgs_invites', 1, 50, column, direction);
    return { data, error };
}

export const createInvite = async (invite: any) => {
    console.log('createInvite', invite);
    try {
        const data = await saveItem('orgs_invites', invite);
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export const updateInvite = async (id: string, invite: Partial<Invite>) => {
    try {
        const data = await saveItem('orgs_invites', { id, ...invite });
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export const deleteInvite = async (id: string) => {
    try {
        await deleteItem('orgs_invites', id);
        return { error: null };
    } catch (error) {
        return { error };
    }
}
