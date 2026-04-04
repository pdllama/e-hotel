import { dbPool } from "../../../../db/pool";
import { query_address } from "../../../../db/queries/user-management";
import { insert_address } from "../../../../db/queries/user-management";
import { sign_up_user } from "../../../../db/queries/user-management";
import {v4 as uuidv4} from 'uuid'

export async function POST({request }:any) {
    const {chain_name, address} = await request.json()

    // checking address uniqueness
    let address_id = uuidv4()
    try {
        const response = await dbPool.query(query_address(address)).then(v => v.rows[0])
        if (response == undefined) throw new Error();
        // Note: We can't have hotel chains sharing addresses with other hotel chains/hotels/people like people can share addresses with other people.
        return new Response(JSON.stringify({ error: 'The provided chain address is already in use!', status: 403 }));
    } catch (err) {
        
    }

    //checking chain name uniqueness
    try {
        const response = await dbPool.query(`SELECT 1 FROM hotel_chain WHERE chain_name = '${chain_name}'`).then(v => v.rows[0])
        if (response == undefined) {throw new Error()}
        return new Response(JSON.stringify({error: 'The chain name is not unique!', status: 403}))
    } catch (e) {}

    try {
        await dbPool.query(insert_address(address, address_id))
        await dbPool.query(`INSERT INTO hotel_chain(chain_name, co_address) VALUES ('${chain_name}', '${address_id}')`)
        return new Response(JSON.stringify({ success: true, status: 201 }));
    } catch (err) {
        console.log(err)
        return new Response(JSON.stringify({ error: err.message, status: 403 }));
    }
}