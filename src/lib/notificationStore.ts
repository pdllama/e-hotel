import { writable, type Writable } from "svelte/store"

export interface NotificationDetails {
    body:string,
    success:boolean,
    errorStatus:number|null
}

export interface Notification {
    id:string,
    body:string,
    success:boolean,
    errorStatus:number|null
}

export const notifications:Writable<Notification[]> = writable([])

export const addNotification = (notification:NotificationDetails) => {
    const id = Math.random().toString(36).substring(2);
    notifications.update((state:Notification[]) => [...state, {...notification, id}])

    setTimeout(() => {
        removeNotification(id);
    }, 5000)
}

export const removeNotification = (id:string) => {
    notifications.update((state) => state.filter((n:Notification) => n.id !== id));
}