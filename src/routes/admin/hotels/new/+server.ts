import { dbPool } from "../../../../db/pool";
import { query_address } from "../../../../db/queries/user-management";
import { insert_address } from "../../../../db/queries/user-management";
import { sign_up_user } from "../../../../db/queries/user-management";
import {v4 as uuidv4} from 'uuid'

export async function POST({request }:any) {
    const {chain_name, hotel_address, SSN, checkedSSNType, personAddress, personName, education_level} = await request.json()

    
    // We need to construct the manager first if he doesn't exist yet.
    if (checkedSSNType != 'employee') {
        if (checkedSSNType == 'person') {
            await dbPool.query(`INSERT INTO employee(SSN, education_level) VALUES (${SSN}, '${education_level}')`)
        } else {
            let address_id = ''
            let create_new_add = true
            try {
                const response = await dbPool.query(query_address(personAddress)).then(v => v.rows[0])
                if (response == undefined) throw new Error();
                const inUseByChainOrHotel = await dbPool.query(`SELECT 1 FROM hotel WHERE address_id = '${response.address_id}'`).then(v => v.rows[0]) !== undefined || 
                await dbPool.query(`SELECT 1 FROM hotel_chain WHERE co_address = '${response.address_id}'`).then(v => v.rows[0]) !== undefined
                if (inUseByChainOrHotel) {return new Response(JSON.stringify({ error: "Person's address is in use by a hotel or hotel chain!", status: 400 }));}
                address_id = response.address_id
                create_new_add = false
            } catch (err) {
                address_id = uuidv4()
            }

            try {
                if (create_new_add) {await dbPool.query(insert_address(personAddress, address_id))}
                await dbPool.query(sign_up_user(SSN, personName.first_name, personName.middle_name, personName.last_name, address_id)); //adds person
                await dbPool.query(`INSERT INTO employee(SSN, education_level) VALUES (${SSN}, '${education_level}')`)
            } catch (err) {
                console.log(err)
                return new Response(JSON.stringify({ error: err.message, status: 400 }));
            }
        }
    }

    // Now we can insert the hotel information

    let hotel_address_id = ''
    try {
        const response = await dbPool.query(query_address(hotel_address)).then(v => v.rows[0])
        if (response == undefined) throw new Error();
        // Note: We can't have hotels sharing addresses with other hotels/people like people can share addresses with other people.
        return new Response(JSON.stringify({ error: 'The provided hotel address is already in use!', status: 403, hotel_id: hotel_address_id }));
    } catch (err) {
        hotel_address_id = uuidv4()
    }

    try {
        await dbPool.query(insert_address(hotel_address, hotel_address_id))
        await dbPool.query(`INSERT INTO hotel(address_id, chain_name, manager_id) VALUES ('${hotel_address_id}', '${chain_name}', ${SSN})`)
        await dbPool.query(`INSERT INTO works_in(address_id, SSN, role, pay, pay_struct) VALUES ('${hotel_address_id}', ${SSN}, 'General Manager', 120000, 'salary')`) //Just initial values. Can be changed later
        return new Response(JSON.stringify({ success: true, status: 201, hotel_id: hotel_address_id }));
    } catch (err) {
        console.log(err)
        return new Response(JSON.stringify({ error: err.message, status: 400 }));
    }
}

export async function GET({url}:any) {
    // This query determines what level a given SSN exists in the DB
    // aka if the person doesnt exist, if the person exists in the db but not as an employee, or if the person exists already as an employee, either fired previously or working for another hotel currently.
    
    const SSN = url.searchParams.get('SSN')

    const person = await dbPool.query(`SELECT * FROM person p LEFT JOIN employee e ON (p.SSN = e.SSN) WHERE p.SSN = ${SSN}`).then(v => v.rows[0]);

    const personExists = person != undefined
    const employeeExists = personExists && person.education_level

    return new Response(JSON.stringify({success: true, status: 201, type: !personExists ? 'none' : !employeeExists ? 'person' : 'employee', person}))
}