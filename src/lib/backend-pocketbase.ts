// POCKETBASE BACKEND
import PocketBase from 'pocketbase';
import type { RecordModel } from 'pocketbase';
import { writable } from 'svelte/store';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public'

export const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
export const user = writable<RecordModel | null>(null);
// 		// ? pb.getFileUrl($user, $user.avatar, { thumb: '100x100' })
// Add this new store for the currently selected orgid
export const currentOrgId = writable<string | null>(null);

// You might want to add a function to update the currentOrgId
export const setCurrentOrgId = (orgId: string | null) => {
  currentOrgId.set(orgId);
};

// Optionally, you can add a function to get the current orgId from the store
export const getCurrentOrgId = (): Promise<string | null> => {
  return new Promise((resolve) => {
    currentOrgId.subscribe(value => {
      resolve(value);
    })();
  });
};

// **************************
// **** DATABASE ACTIONS ****
// **************************

export const getItemById = async (collection: string, id: string) => {
    try {
        const data = await pb.collection(collection).getOne(id);
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export const deleteItem = async (collection: string, id: string) => {
    try {
        await pb.collection(collection).delete(id);
        return { error: null };
    } catch (error) {
        return { error };
    }
}

export const saveItem = async (collection: string, item: any) => {
    try {
        let data;
        if (item.id) {
            data = await pb.collection(collection).update(item.id, item);
        } else {
            delete item.id;
            data = await pb.collection(collection).create(item);
        }
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export const getList = async (collection: string, startingIndex: number, perPage: number, sortColumn: string, sortDirection: 'asc' | 'desc') => {
    try {
        const data = await pb.collection(collection).getList(startingIndex, perPage, {
            sort: sortDirection === 'asc' ? sortColumn : `-${sortColumn}`,
        });
        return { data: data.items, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

// ************************
// **** AUTHENTICATION ****
// ************************
export const getAvatarUrl = (user: any) => {
    return pb.getFileUrl(user, user.avatar, { thumb: '100x100' })
}

export const signInWithPassword = async (email: string, password: string) => {
    try {
        const authData = await pb.collection('users').authWithPassword(email, password);
        return '';
    } catch (error) {
        return error;
    }
}

export const signUp = async (email: string, password: string) => {
    try {
        const result = await pb.collection('users').create({
            email,
            password,
            passwordConfirm: password,
        });
        return '';
    } catch (error) {
        return String(error);
    }
}

async function urlToFile(url: string, filename: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
}

async function refreshSession() {
    const { data, error } = await getSession();
    if (data.session) {
        user.set(data.session.user);
    } else if (error) {
        console.error('Error refreshing session:', error);
    }
}


export const signInWithOAuth = async (provider: string) => {
    try {
        const authData = await pb.collection('users').authWithOAuth2({ provider });
        const { data, error } = await getSession();
        if (data?.session?.user) {
            user.set(data.session.user as RecordModel);
        } else if (error) {
            console.error('Error refreshing session:', error);
        }
        const avatarUrl = authData?.meta?.avatarUrl;        
        if (avatarUrl && !authData.record.avatar) {
            const id = authData.record.id;
            
            try {
                const avatarFile = await urlToFile(avatarUrl, 'avatar.jpg');
                const formData = new FormData();
                formData.append('avatar', avatarFile);
                const record = await pb.collection('users').update(id, formData);
            } catch (e) {
                console.error('Failed to update avatar:', e);
                if (e instanceof Error) {
                    console.error('Error message:', e.message);
                }
                if ('data' in e) {
                    console.error('Error data:', e.data);
                }
            }
        }        
        return null;
    } catch (error) {
        console.error('signInWithOAuth error', error);
        return error;
    }
}

export const resetPasswordForEmail = async (email: string) => {
    try {
        await pb.collection('users').requestPasswordReset(email);
        return null;
    } catch (error) {
        return error;
    }
}

export const getSession = async () => {
    await pb.collection('users').authRefresh();
    const authData = pb.authStore.model;
    return {
        data: { session: { user: authData } ? { user: authData } : null },
        error: null
    };
}

export const updateUser = async (obj: any) => {
    obj.user_metadata = obj.user_metadata || {};
    for (const key in obj.data) {
        obj.user_metadata[key] = obj.data[key];
    }
    try {
        const data = await pb.collection('users').update(pb.authStore.model?.id, obj);
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export const signOut = async () => {
    pb.authStore.clear();
    return { error: null };
}