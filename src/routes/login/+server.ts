import { invalidateAll } from "$app/navigation";
import { dbPool } from "../../db/pool";
import { find_person } from "../../db/queries/user-management";
import {v4 as uuidv4} from 'uuid'


export async function POST({ request, cookies }:any) {
    const {SSN} = await request.json();
    const prevSession = cookies.get('session')

    if (!SSN || isNaN(parseInt(SSN))) {return new Response(JSON.stringify({ error: !SSN ? 'SSN required' : 'SSN must be a number!', status: 400 }));}

    const res = await dbPool.query(find_person(SSN));
    const user = res.rows[0];

    if (!user) return new Response(JSON.stringify({error: 'Invalid SSN', status: 401}));

    const sessionToken = uuidv4();
    const expiresAt = new Date(Date.now()+ 7*24 * 60 * 60 * 1000).toISOString() // 1 week

    if (prevSession) {
        await dbPool.query(`DELETE FROM sessions WHERE session_token = '${prevSession}'`);
    }

    await dbPool.query(`
        INSERT INTO sessions(SSN, session_token, expires_at) VALUES (${SSN}, '${sessionToken}', '${expiresAt}')
    `)

    cookies.set('session', sessionToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: false, 
        maxAge: 60*60*24*7
    }) 

    return new Response(JSON.stringify({success: true}))
}