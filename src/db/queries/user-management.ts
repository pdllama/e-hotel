import { dbPool } from "../pool";


// We already have the unique constraint in address, but if a user is signing up, they should be able to have the same address as someone else
// (ex they are housemates with someone else). So we query if there's a matching address first and if it returns an address id, we use that.
export function query_address(address:any) {
    return `
        SELECT *
        FROM address
        WHERE street_number = ${address.street.number} AND 
        street_name = '${address.street.name.replace("'", "''")}' AND 
        apt_number = ${address.street.apt_number == "" ? 0 : address.street.apt_number} AND
        postal_code = '${address.postal_code}' AND 
        city = '${address.city.replace("'", "''")}' AND
        state = '${address.state.replace("'", "''")}' AND 
        country = '${address.country.replace("'", "''")}'
    `
}

export function insert_address(address:any, address_id: string) {
    return `
        INSERT INTO address(address_id, street_number, street_name, apt_number, postal_code, city, state, country) 
        VALUES ('${address_id}',
        ${address.street.number}, 
        '${address.street.name.replace("'", "''")}', 
        ${address.street.apt_number == "" ? 0 : address.street.apt_number}, 
        '${address.postal_code}',
        '${address.city.replace("'", "''")}', 
        '${address.state.replace("'", "''")}', 
        '${address.country.replace("'", "''")}')
    `
}

export function sign_up_user(SSN:number, first_name: string, middle_name: string, last_name: string, address:string) {
    return `
        INSERT INTO person(SSN, first_name, middle_name, last_name, address) 
        VALUES (${SSN}, '${first_name.replace("'", "''")}', '${middle_name.replace("'", "''")}', '${last_name.replace("'", "''")}', '${address}')
    `
}

export function edit_user(SSN:number, first_name:string, middle_name:string, last_name: string, address:string) {
    return `
        UPDATE person SET first_name = '${first_name.replace("'", "''")}', middle_name = '${middle_name.replace("'", "''")}', last_name = '${last_name.replace("'", "''")}'${!address ? '' : `, address = '${address}'`} 
        WHERE SSN = ${SSN}
    `
}

export function find_person(SSN:number) {
    return `SELECT * FROM person WHERE SSN = ${SSN}`
}

export function get_user_data_from_session(token:string) {
    return `
        SELECT p.SSN, p.first_name,
        CASE
            WHEN EXISTS (SELECT 1 FROM hotel h WHERE h.manager_id = p.SSN) THEN 'manager'
            WHEN EXISTS (SELECT 1 FROM works_in w WHERE w.SSN = p.SSN) THEN 'employee'
            ELSE 'customer'
        END AS accountType
        FROM person p NATURAL JOIN sessions s
        WHERE session_token = '${token}'
    `
}