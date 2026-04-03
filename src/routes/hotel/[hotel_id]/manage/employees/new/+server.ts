import { dbPool } from "../../../../../../db/pool"
import { query_address } from "../../../../../../db/queries/user-management"
import {v4 as uuidv4} from 'uuid'
import { sign_up_user } from "../../../../../../db/queries/user-management"
import { insert_address } from "../../../../../../db/queries/user-management"

export async function POST({request }:any) {
    const {hotel_id, SSN, name, address, education_level, role, pay, pay_struct} = await request.json()

    if (address != undefined) { // aka we have to create the addres and person first in the db.
        let address_id = ''
        let create_new_add = true
        try {
            const response = await dbPool.query(query_address(address)).then(v => v.rows[0])
            if (response == undefined) throw new Error();
            address_id = response.address_id
            create_new_add = false
        } catch (err) {
            address_id = uuidv4()
        }

        try {
            if (create_new_add) {await dbPool.query(insert_address(address, address_id))}
            await dbPool.query(sign_up_user(SSN, name.first_name, name.middle_name, name.last_name, address_id)); //adds person
        } catch (err) {
            console.log(err)
            return new Response(JSON.stringify({ error: err.message, status: 400 }));
        }
    }
    if (education_level != undefined) { // aka we have to insert into employee
        await dbPool.query(`INSERT INTO employee(SSN, education_level) VALUES (${SSN}, '${education_level}')`)
    }

    await dbPool.query(`INSERT INTO works_in(address_id, SSN, role, pay, pay_struct) VALUES ('${hotel_id}', ${SSN}, '${role}', ${pay}, '${pay_struct}')`)

    return new Response(JSON.stringify({ success: true, status: 201 }));
}

export async function GET({url}:any) {
    // This query determines what level a given SSN exists in the DB
    // aka if the person doesnt exist, if the person exists in the db but not as an employee, or if the person exists already as an employee, either fired previously or working for another hotel currently.
    
    const SSN = url.searchParams.get('SSN')
    const hotel_id = url.searchParams.get('hotel')

    const person = await dbPool.query(`SELECT * FROM person p LEFT JOIN employee e ON (p.SSN = e.SSN) WHERE p.SSN = ${SSN}`).then(v => v.rows[0]);

    const personExists = person != undefined
    const employeeExists = personExists && person.education_level

    const isAlreadyEmployee = employeeExists ? await dbPool.query(`SELECT * FROM works_in WHERE SSN = ${SSN} AND address_id = '${hotel_id}'`).then(v => v.rows[0]) != undefined : false

    return new Response(JSON.stringify({success: true, status: 201, type: !personExists ? 'none' : !employeeExists ? 'person' : 'employee', person, isAlreadyEmployee}))
}