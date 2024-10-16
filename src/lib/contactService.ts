import { getItemById, deleteItem, saveItem, getList, currentOrgId } from './backend';
import type { Contact } from '$lib/types/contact';
import { faker } from '@faker-js/faker';

export const getContactById = async (id: string) => {
    try {
        const data = await getItemById('contacts', id);
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export const deleteContact = async (id: string) => {
    try {
        await deleteItem('contacts', id);
        return { error: null };
    } catch (error) {
        return { error };
    }
}

export const saveContact = async (contact: Contact) => {
    const orgId = await getCurrentOrgId();
    contact.orgid = orgId;
    console.log('saveContact', contact);
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

export function generateRandomContact(): Contact {
    return {
        id: faker.string.uuid(),
        orgid: '', // This will be set in saveContact
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email(),
        notes: faker.lorem.paragraph(),
    };
}

export async function generateRandomContacts(count: number) {
    const arr = Array.from({ length: count }, () => generateRandomContact());
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

async function getCurrentOrgId(): Promise<string> {
    return new Promise((resolve) => {
        currentOrgId.subscribe(value => {
            resolve(value || '');
        })();
    });
}
