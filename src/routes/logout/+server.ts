import { invalidateAll } from "$app/navigation";
import { dbPool } from "../../db/pool";
import { find_person } from "../../db/queries/user-management";
import {v4 as uuidv4} from 'uuid'


export async function POST({ cookies }:any) {
    const token = cookies.get('session');

    if (token) {
        await dbPool.query(`DELETE FROM sessions WHERE session_token = '${token}'`);
    }

    cookies.delete('session', {
        path: '/'
    })

    return new Response(JSON.stringify({success: true}))
}