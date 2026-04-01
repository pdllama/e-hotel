import { redirect } from "@sveltejs/kit";
import { addNotification } from "$lib/notificationStore";

export function authenticate(locals:any, redirectLink:string, notificationDetails:any) {
    if (!locals.user) {
        addNotification(notificationDetails)
        redirect(308, redirectLink);
    }
}

export function authorize(user_data:any, redirectLink:string, notificationDetails:any, manager_route:boolean=false) {
    if (!user_data) {
        addNotification(notificationDetails)
        redirect(308, redirectLink);
    }
    if (manager_route && (user_data.role != 'General Manager' && user_data.SSN != 100000000)) {
        addNotification(notificationDetails)
        redirect(308, redirectLink);
    }
}