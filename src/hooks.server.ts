import type { Handle } from '@sveltejs/kit';
import { dbPool } from './db/pool';
import { getUserFromSession } from '$lib/session';
// Import your database utility for fetching user data (e.g., getUserBySession)

export const handle: Handle = async ({ event, resolve }) => {
    const sessionCookie = event.cookies.get('session');

    if (sessionCookie) {
        // Validate the session ID and fetch user details from your database
        const user = await getUserFromSession(sessionCookie); 
        if (user) {
            event.locals.user = {
                SSN: user.ssn,
                first_name: user.first_name,
                accountType: user.accounttype
            };
        }
    } else {
        event.locals.user = null;
    }

    return resolve(event);
};