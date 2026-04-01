

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
        WHERE guest_id = '${SSN}'
    `
}

export function search_customer_bookings(SSN:number, status:string, from:string, to: string, skip:number=0) {
    return `
        SELECT
        archive_id, guest_id, room_number, status, 
        stay_start_date, stay_end_date,
        created_at, paid_for,
        check_in_time, check_out_time,
        chain_name, street_name, street_number, city, state, country,
        price, capacity, COUNT(*) OVER() AS totalCount
        FROM archive_view
        WHERE guest_id = ${SSN}${construct_c_booking_where(status, from, to)} 
        OFFSET ${skip} ROWS FETCH NEXT 5 ROWS ONLY
    `
}

function construct_c_booking_where(status:string, from:string, to:string) {
    let where = ''
    if (status) {
        where += ` AND status = '${status}'`
    }
    if (from) {
        where += ` AND stay_start_date > '${from}'`
    }
    if (to) {
        where += ` AND stay_end_date < '${to}'`
    }
    return where
}

export function get_archive(aID:string) {
    return `
        SELECT
        av.archive_id, av.address_id, av.guest_id, av.room_number, av.status, 
        av.stay_start_date, av.stay_end_date,
        av.created_at, av.paid_for,
        av.check_in_time, av.check_out_time,
        av.chain_name, av.street_name, av.street_number, av.city, av.state, av.country,
        av.price, av.capacity, av.view, av.extension_possible, amenities
        FROM archive_view av LEFT JOIN ( 
            SELECT ta.address_id, ta.room_number, json_agg(amenity_name) AS amenities 
            FROM (
                SELECT DISTINCT h.address_id, rha.room_number, rha.amenity_name
                FROM hotel h LEFT JOIN room_has_amenity rha ON (h.address_id = rha.address_id)
            ) ta
            GROUP BY (ta.address_id, ta.room_number)
        ) ta ON (av.address_id = ta.address_id AND av.room_number = ta.room_number)
        WHERE av.archive_id = '${aID}'
    `
}


export function select_hotel_bookings(address_id:string, is_dashboard:boolean=true) {
    return `SELECT 
        archive_id, address_id, room_number, status, 
        stay_start_date, stay_end_date,
        created_at, paid_for,
        check_in_time, check_out_time,
        first_name, middle_name, last_name,
        price, capacity
        FROM archive_view
        WHERE address_id = '${address_id}'${is_dashboard ? " AND (status = 'renting' OR status = 'booked')" : ''}
    `
}

export function select_ongoing_problems(address_id:string, skip:number=0, num_rows:number=3) {
    return `SELECT *, COUNT(*) OVER() AS totalCount FROM room_problem WHERE address_id = '${address_id}' AND status = 'ongoing' OFFSET ${skip} FETCH NEXT ${num_rows} ROWS ONLY`
}


// When doing a direct rental, we know the customer is going to be using the room immediately to some point in the future.
// This query gets the nearest booking from the current date to see whats the absolute longest the customer can stay.
export function get_nearest_booking(address_id:string, room_number:number) {
    return `
        SELECT MIN(stay_start_date) as nearest_booking
        FROM (
            SELECT stay_start_date 
            FROM archive
            WHERE status = 'booked' 
                AND address_id = '${address_id}'
                AND room_number = ${room_number} 
                AND stay_start_date > CURRENT_DATE
        )
    `
}


// archive_id      UUID    PRIMARY KEY,
// guest_id        INTEGER,
// address_id      UUID,
// room_number     INTEGER,
// status          archive_status,
// stay_start_date DATE,
// stay_end_date   DATE,