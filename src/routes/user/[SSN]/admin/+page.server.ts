import { authenticate, authorize } from "../../../authentication";

export async function load({ locals }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    authorize(locals.user.SSN == 100000000, `/user/${locals.user.SSN}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})

    return {
        user: {...locals.user}
    };
}
