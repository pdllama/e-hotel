
/* This is to get all relevant information of a particular archive */
CREATE VIEW archive_view as
SELECT 
    a.archive_id, a.address_id, a.guest_id, a.room_number, a.status, /* Basic archive information */
    a.stay_start_date, a.stay_end_date, /* Start Date and End Date */
    b.created_at, b.paid_for, /* Booking information, or null if theres no booking */
    r.check_in_time, r.check_out_time, /* Rental information, or null if theres no rental yet/still ongoing/cancelled booking */
    h.chain_name, /* Hotel Chain Name */
    add.street_name, add.street_number, add.postal_code, add.city, add.state, add.country, /* Address information */
    ro.price, ro.capacity, ro.view, ro.extension_possible, /* room information */
    p.first_name, p.middle_name, p.last_name /* Person Data */
FROM archive a 
    LEFT JOIN booking b ON (a.archive_id = b.archive_id)
    LEFT JOIN rental r ON (a.archive_id = r.archive_id)
    LEFT JOIN address add ON (a.address_id = add.address_id)
    LEFT JOIN hotel h ON (a.address_id = h.address_id)
    LEFT JOIN room ro ON (a.room_number = ro.room_number AND a.address_id = ro.address_id)
    LEFT JOIN person p ON (a.guest_id = p.SSN)
;