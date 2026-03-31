

// Select a specific customer's archives'. Rentals and Bookings
export function select_customer_bookings(SSN:number) {
    return `SELECT 
        archive_id, guest_id, room_number, status, 
        stay_start_date, stay_end_date,
        created_at, paid_for,
        check_in_time, check_out_time,
        chain_name, street_name, street_number, city, state, country,
        price, capacity
        FROM archive_view
        WHERE guest_id = ${SSN}
    `
}

export function search_customer_bookings(SSN:number, status:string, from:string, to: string, skip:number) {
    return `
        archive_id, guest_id, room_number, status, 
        stay_start_date, stay_end_date,
        created_at, paid_for,
        check_in_time, check_out_time,
        chain_name, street_name, street_number, city, state, country,
        price, capacity
        FROM archive_view
        
    `
}

function construct_c_booking_where(status:string, from:string, to:string) {
    let where = 'WHERE '
    if (status) {
        where += `status = '${status}'`
    }
    if (from) {
        
    }
}



// archive_id      UUID    PRIMARY KEY,
// guest_id        INTEGER,
// address_id      UUID,
// room_number     INTEGER,
// status          archive_status,
// stay_start_date DATE,
// stay_end_date   DATE,