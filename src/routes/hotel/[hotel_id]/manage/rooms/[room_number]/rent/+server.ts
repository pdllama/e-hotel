import { dbPool } from "../../../../../../../db/pool"
import { query_address } from "../../../../../../../db/queries/user-management";
import {v4 as uuidv4} from 'uuid'
import { insert_address } from "../../../../../../../db/queries/user-management";
import { edit_user } from "../../../../../../../db/queries/user-management";


export async function POST({request }:any) {
    const {SSN, address, name, createNewCustomer, hotel_id, room_number, stay_start_date, stay_end_date} = await request.json();

    if (!SSN || isNaN(parseInt(SSN))) {return new Response(JSON.stringify({ error: !SSN ? 'SSN required' : 'SSN must be a number!', status: 400 }));}

    let address_id = ''
    let create_new_add = true
    if (createNewCustomer) {
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
        if (createNewCustomer) {
            if (create_new_add) {await dbPool.query(insert_address(address, address_id))}
            await dbPool.query(`INSERT INTO person(SSN, first_name, middle_name, last_name, address_id) VALUES (${SSN}, '${name.first_name}', '${name.middle_name}', '${name.last_name}', '${address_id}')`)
        }
        const aId = uuidv4()
        await dbPool.query(`INSERT INTO archive(archive_id, guest_id, address_id, room_number, status, stay_start_date, stay_end_date) VALUES 
            ('${aId}', ${SSN}, '${hotel_id}', ${room_number}, 'renting', '${stay_start_date}', '${stay_end_date}')`)
        return new Response(JSON.stringify({ success: true, status: 201 }));
    } catch (err) {
        console.log(err)
        return new Response(JSON.stringify({ error: 'Unknown Error Occurred', status: 400 }));
    }
}