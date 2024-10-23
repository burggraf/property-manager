import { getItemById, deleteItem, saveItem, getList, getCurrentOrgId } from '$lib/backend.svelte.ts';
import type { Contact } from '$lib/types/contact.ts';
import { faker } from '@faker-js/faker';

export const getContactById = async (id: string) => {
    const orgId = await getCurrentOrgId();
    try {
        const data = await getItemById('contacts', id, 'orgid', orgId);
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export const deleteContact = async (id: string) => {
    const orgId = await getCurrentOrgId();
    try {
        await deleteItem('contacts', id, 'orgid', orgId);
        return { error: null };
    } catch (error) {
        return { error };
    }
}

export const saveContact = async (contact: Contact) => {
    if (!contact.orgid) {
        const orgId = await getCurrentOrgId();
        contact.orgid = orgId;
    }
    const { data, error } = await saveItem('contacts', contact);
    return { data, error };
}

export const getAllContacts = async () => {
    return fetchContacts('lastname', 'asc');
}

export async function fetchContacts(column: string, direction: 'asc' | 'desc') {
    const orgId = await getCurrentOrgId();
    const { data, error } = await getList('contacts', 1, 50, column, direction, 'orgid', orgId);
    return { data, error };
}

export function generateRandomContact(): Promise<Contact> {
    return {
        //id: '', // faker.string.uuid(),
        orgid: '', // This will be set in saveContact
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email(),
        notes: faker.lorem.paragraph(),
    };
}

export async function generateRandomContacts(count: number) {
    const arr = Array.from({ length: count }, () => generateRandomContact());
    //console.log(arr);
    //return;
    // save each contact to the database
    for (const contact of arr) {
        const { data, error } = await saveContact(contact);
        if (error) {
            console.error(error);
            return { error };
        }
    }
    return arr;
}

