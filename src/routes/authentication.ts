import { redirect } from "@sveltejs/kit";
import { addNotification } from "$lib/notificationStore";

export function authenticate(locals:any, redirectLink:string, notificationDetails:any) {
    if (!locals.user) {
        addNotification(notificationDetails)
        redirect(308, redirectLink);
    }
}

export function authorize(authorized:boolean, redirectLink:string, notificationDetails:any) {
    if (!authorized) {
        addNotification(notificationDetails)
        redirect(308, redirectLink);
    }
}