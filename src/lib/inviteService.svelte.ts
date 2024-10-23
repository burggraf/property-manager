import { getItemById, deleteItem, saveItem, getList } from './backend.svelte.ts';
import type { Invite } from '$lib/types/invite.ts';
import { supabase, getUser } from './backend.svelte.ts';
const user = $derived(getUser());
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
        const { error } = await deleteItem('orgs_invites', id);
        if (error) {
            console.error('Error deleting invite:', error);
        }
        return { error: null };
    } catch (error) {
        return { error };
    }
}

export const getMyInvites = async () => {
    const { data, error } = 
        await getList('orgs_invites', 1, 50, 'created_at', 'desc', 
            'email', user?.email);
    return { data, error };
}

export const acceptInvite = async (id: string) => {
    try {
        const { data, error } = await supabase.rpc('accept_invite', { invite_id: id });
        if (error) {
            console.error('Error accepting invite:', error);
            return { data: null, error };
        }
        return { data, error: null };
    } catch (error) {
        console.error('Unexpected error accepting invite:', error);
        return { data: null, error };
    }
}
