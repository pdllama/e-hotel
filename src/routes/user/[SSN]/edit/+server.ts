import { dbPool } from "../../../../db/pool";
import { insert_address, query_address, edit_user } from "../../../../db/queries/user-management";
import {v4 as uuidv4} from 'uuid'

export async function POST({ request }:any) {
    const {SSN, address, name, editedAddress} = await request.json();

    if (!SSN || isNaN(parseInt(SSN))) {return new Response(JSON.stringify({ error: !SSN ? 'SSN required' : 'SSN must be a number!', status: 400 }));}

    let address_id = ''
    let create_new_add = true
    if (editedAddress) {
        try {
            const response = await dbPool.query(query_address(address)).then(v => v.rows[0])
            if (response == undefined) throw new Error();
            address_id = response.address_id
            create_new_add = false
        } catch (err) {
            address_id = uuidv4()
        }
    }

    try {
        if (create_new_add && editedAddress) {await dbPool.query(insert_address(address, address_id))}
        await dbPool.query(edit_user(SSN, name.first_name, name.middle_name, name.last_name, address_id));
        return new Response(JSON.stringify({ success: true, status: 201 }));
    } catch (err) {
        console.log(err)
        return new Response(JSON.stringify({ error: 'Unknown Error Occurred', status: 400 }));
    }
}