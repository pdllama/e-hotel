

/* 
    Index on archive availability aka for stay start date and stay end date
    Useful because we want to ensure theres no overlap between archives, which requires frequent checks on archives 
    for all customers looking to book rooms
 */
CREATE INDEX archive_availability
ON archive (address_id, room_number, status, stay_start_date, stay_end_date);


/* 
    Index on room_has_amenity pks
    Useful because we VERY FREQUENTLY do joins on room_has_amenity to query hotels and specific rooms for has_amenity.
 */

CREATE INDEX rha_room ON room_has_amenity (address_id, room_number);


/* 
    Index on room 
    Useful because customers often filter rooms by price.
 */
CREATE INDEX room_address_price ON room (address_id, price);