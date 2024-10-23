// SUPABASE BACKEND
// import { writable } from 'svelte/store';
import type { User } from '@supabase/supabase-js';
// import type { Contact } from '$lib/types/contact.ts';

import { supabase } from '$lib/supabase.ts'
export { supabase };  // Add this line to export the supabase object
import { locale } from '$lib/i18n/index.ts';
let user = $state<User | null>(null)
// Add this getter function
export function getUser() {
  return user;
}
export const setUser = (newUser: User | null) => {
  user = newUser;
}
export function initializeUser() {
  $effect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      user = session?.user ?? null
    })

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        user = session?.user ?? null

        const userLocale = user?.user_metadata?.i18n
				if (userLocale) {
					locale.set(userLocale)
					localStorage.setItem('locale', userLocale)
				}
				// Fetch currentOrgId from user metadata and set it
				const newCurrentOrgId = user?.user_metadata?.currentOrgId
				if (newCurrentOrgId) {
					currentOrgId = newCurrentOrgId
				}
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  })
}
// Add this new store for the currently selected orgid
let currentOrgId = $state<string | null>(null)
export function getCurrentOrgId() {
  return currentOrgId;
}
export const setCurrentOrgId = async (newOrgId: string | null) => {
  currentOrgId = newOrgId;
  const { data: updateUserData, error: updateUserError } = await updateUser({
    data: { currentOrgId: newOrgId },
  })
  if (updateUserError) {
    return false;
  } else {
    return true;
  }
}


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
