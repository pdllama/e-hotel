import { dbPool } from "../../db/pool";
import { insert_address, query_address, sign_up_user } from "../../db/queries/user-management";
import {v4 as uuidv4} from 'uuid'

export async function POST({ request }:any) {
    const {SSN, address, name} = await request.json();

    if (!SSN || isNaN(parseInt(SSN))) {return new Response(JSON.stringify({ error: !SSN ? 'SSN required' : 'SSN must be a number!', status: 400 }));}

    let address_id = ''
    let create_new_add = true
    try {
        const response = await dbPool.query(query_address(address)).then(v => v.rows[0])
        if (response == undefined) throw new Error();
        const inUseByChainOrHotel = await dbPool.query(`SELECT 1 FROM hotel WHERE address_id = '${response.address_id}'`).then(v => v.rows[0]) !== undefined || 
            await dbPool.query(`SELECT 1 FROM hotel_chain WHERE co_address = '${response.address_id}'`).then(v => v.rows[0]) !== undefined
        if (inUseByChainOrHotel) {return new Response(JSON.stringify({ error: 'Address is in use by a hotel or hotel chain!', status: 400 }));}
        address_id = response.address_id
        create_new_add = false
    } catch (err) {
        address_id = uuidv4()
    }

    try {
        if (create_new_add) {await dbPool.query(insert_address(address, address_id))}
        await dbPool.query(sign_up_user(SSN, name.first_name, name.middle_name, name.last_name, address_id));
        await dbPool.query(`INSERT INTO customer(SSN) VALUES (${SSN})`)
        return new Response(JSON.stringify({ success: true, status: 201 }));
    } catch (err) {
        console.log(err)
        return new Response(JSON.stringify({ error: err.message, status: 400 }));
    }
}