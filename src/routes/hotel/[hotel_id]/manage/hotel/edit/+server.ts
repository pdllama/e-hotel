import { dbPool } from "../../../../../../db/pool";

export async function PUT({request }:any) {
    const {hotel_id, phone_numbers, emails, oldPhoneNumbers, oldEmails} = await request.json()

    const addedNumbers = phone_numbers.filter((pn:string) => !oldPhoneNumbers.includes(pn) && pn != '')
    const removedNumbers = oldPhoneNumbers.filter((pn:string) => !phone_numbers.includes(pn))

    const addedEmails = emails.filter((e:string) => !oldEmails.includes(e) && e != '')
    const removedEmails = oldEmails.filter((e:string) => !emails.includes(e))

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