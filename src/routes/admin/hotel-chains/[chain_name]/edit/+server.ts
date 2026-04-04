import { dbPool } from "../../../../../db/pool";
import { query_address } from "../../../../../db/queries/user-management";

export async function PUT({request }:any) {
    //({old_chain_name: data.chain_name, new_chain_name: form.chain_name, changedAddress, newAddress: form.address, phone_numbers: form.phone_numbers, emails: form.emails, oldPhoneNumbers: data.chain.phone_numbers, oldEmails: data.chain.emails})
    const {old_chain_name, new_chain_name, newAddress, changedAddress, phone_numbers, emails, oldPhoneNumbers, oldEmails} = await request.json()


    if (old_chain_name != new_chain_name) {
        try {
            await dbPool.query(`UPDATE hotel_chain SET chain_name = '${new_chain_name}' WHERE chain_name = '${old_chain_name}'`)
        } catch(err) {
            console.log(err)
            return new Response(JSON.stringify({ error: `There was an error when changing the chain name: ${err.message}`, status: 403 }));
        }
    }

    if (changedAddress) {
        try {
            const response = await dbPool.query(query_address(newAddress)).then(v => v.rows[0])
            if (response == undefined) throw new Error();
            // Note: We can't have hotels sharing addresses with other hotels/people like people can share addresses with other people.
            return new Response(JSON.stringify({ error: 'The provided central office address is already in use!', status: 403 }));
        } catch (err) {
  
        }
        try {
            // Note: We know that this address_id is uniquely used only for this hotel chain. Meaning we can just update address
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
        await dbPool.query(`INSERT INTO chain_phone_number(chain_name, phone_number) VALUES ('${new_chain_name}', '${an}')`)
    }

    for (let rn of removedNumbers) {
        await dbPool.query(`DELETE FROM chain_phone_number WHERE address_id = '${new_chain_name}' AND phone_number = '${rn}'`)
    }

    for (let ae of addedEmails) {
        await dbPool.query(`INSERT INTO chain_email(address_id, e_mail) VALUES ('${new_chain_name}', '${ae}')`)
    }

    for (let re of removedEmails) {
        await dbPool.query(`DELETE FROM chain_email WHERE address_id = '${new_chain_name}' AND e_mail = '${re}'`)
    }
    

    return new Response(JSON.stringify({ success: true, status: 201 }));
}