export function load({ locals }:any) {
    return {
        user: locals.user
    };
}



//EXAMPLE OF PROTECTING ROUTES
//import { redirect } from '@sveltejs/kit';

// export function load({ locals }) {
//     if (!locals.user) {
//         throw redirect(302, '/login');
//     }
// }