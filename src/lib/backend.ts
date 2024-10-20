// SUPABASE BACKEND
import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { writable } from 'svelte/store';
import type { User } from '@supabase/supabase-js';
import type { Contact } from '$lib/types/contact';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)
export const user = writable<User | null>(null);
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

export const getItemById = async (collection: string, id: string, filterColumn?: string, filterValue?: string) => {
    let query = supabase
        .from(collection)
        .select('*')
        .eq('id', id);

    if (filterColumn && filterValue) {
        query = query.eq(filterColumn, filterValue);
    }

    const { data, error } = await query.single();

    return {
        data,
        error
    };
}

export const deleteItem = async (collection: string, id: string, filterColumn?: string, filterValue?: string) => {
    let query = supabase
        .from(collection)
        .delete()
        .eq('id', id);

    if (filterColumn && filterValue) {
        query = query.eq(filterColumn, filterValue);
    }

    const { error } = await query;
    return {
        error
    };
}

export const saveItem = async (collection: string, item: any) => {
    const { data, error } = await supabase
    .from(collection)
    .upsert(item);
    return {
        data,
        error
    };
}

export const getList = async (collection: string, startingIndex: number, perPage: number, sortColumn: string, sortDirection: 'asc' | 'desc', filterColumn?: string, filterValue?: string) => {

    let query = supabase
      .from(collection)
      .select('*')
      .order(sortColumn, { ascending: sortDirection === 'asc' })
      .range(startingIndex - 1, startingIndex + perPage - 1);

    if (filterColumn && filterValue) {
      query = query.eq(filterColumn, filterValue);
    }

    const { data, error } = await query;
        
    return { data, error} // data || [];
}

// ************************
// **** AUTHENTICATION ****
// ************************

export const getAvatarUrl = (user: User) => {
  return user?.user_metadata?.picture || '';
}

export const signInWithPassword = async (email: string, password: string) => {    
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        return signInError;
      } else {
        return '';
      }
}

export const signUp = async (email: string, password: string) => {
    const currentLanguage = localStorage.getItem('locale') || 'en';
    const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
              language: currentLanguage,
              i18n: currentLanguage
            }
          }
      });
      return String(signUpError);
}

export const signInWithOAuth = async (provider: string) => {
    let currentUrl = window.location.href;
    localStorage.setItem('redirectUrl', currentUrl)
    const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin + '/auth/redirect'}` //currentUrl ? currentUrl :`${window.location.origin}/`
        }
      });
      return signInError;
}

export const resetPasswordForEmail = async (email: string) => {
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      return resetError;
}

export const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    return {
        data,
        error
    };
}

export const updateUser = async (obj: any) => {
    const { data, error } = await supabase.auth.updateUser(obj);
    return {
        data,
        error
    };
}

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return {
        error
    };
}
