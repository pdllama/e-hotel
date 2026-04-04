import { dbPool } from "../../../../../../db/pool";
import { query_address } from "../../../../../../db/queries/user-management";

export async function PUT({request }:any) {
    const {hotel_id, newAddress, changedAddress, phone_numbers, emails, oldPhoneNumbers, oldEmails} = await request.json()

    if (changedAddress) {
        try {
            const response = await dbPool.query(query_address(newAddress)).then(v => v.rows[0])
            if (response == undefined) throw new Error();
            // Note: We can't have hotels sharing addresses with other hotels/people like people can share addresses with other people.
            return new Response(JSON.stringify({ error: 'The provided hotel address is already in use!', status: 403 }));
        } catch (err) {
  
        }
        try {
            // Note: We know that this address_id is uniquely used only for this hotel. Meaning we can just update address
            await dbPool.query(`UPDATE address SET street_name = '${newAddress.street.name}', street_number = ${newAddress.street.number}, apt_number = ${newAddress.street.apt_number}, postal_code = '${newAddress.postal_code}', city = '${newAddress.city}', state = '${newAddress.state}', country = '${newAddress.country}' WHERE address_id = '${hotel_id}'`)
        } catch (err) {
            console.log(err)
            return new Response(JSON.stringify({ error: err.message, status: 400 }));
        }
    }

    const addedNumbers = !phone_numbers ? [] : phone_numbers.filter((pn:string) => !oldPhoneNumbers.includes(pn) && pn != '')
    const removedNumbers = !oldPhoneNumbers ? [] : oldPhoneNumbers.filter((pn:string) => !phone_numbers.includes(pn))

    const addedEmails = !emails ? [] : emails.filter((e:string) => !oldEmails.includes(e) && e != '')
    const removedEmails = !oldEmails ? [] : oldEmails.filter((e:string) => !emails.includes(e))

    for (let an of addedNumbers) {
        await dbPool.query(`INSERT INTO hotel_phone_number(address_id, phone_number) VALUES ('${hotel_id}', '${an}')`)
    }

    for (let rn of removedNumbers) {
        await dbPool.query(`DELETE FROM hotel_phone_number WHERE address_id = '${hotel_id}' AND phone_number = '${rn}'`)
    }

    for (let ae of addedEmails) {
        await dbPool.query(`INSERT INTO hotel_email(address_id, e_mail) VALUES ('${hotel_id}', '${ae}')`)
    }

    for (let re of removedEmails) {
        await dbPool.query(`DELETE FROM hotel_email WHERE address_id = '${hotel_id}' AND e_mail = '${re}'`)
    }
    

    return new Response(JSON.stringify({ success: true, status: 201 }));
}