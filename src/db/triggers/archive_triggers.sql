
/* 
    You shouldn't be able to create a rental/booking at a given time if there is already a scheduled 
    booking that overlaps with those dates.

    This trigger stops archive inserts (bookings or direct rentals) that overlap with a previous one.
 */ 

CREATE OR REPLACE FUNCTION check_overlap()
RETURNS TRIGGER AS $$
BEGIN 
    IF (NEW.status = 'booked' OR NEW.status = 'renting')
    THEN 
        IF EXISTS (
            SELECT 1 FROM archive WHERE address_id = NEW.address_id AND room_number = NEW.room_number AND stay_start_date < NEW.stay_end_date AND stay_end_date > NEW.stay_start_date
        )
        THEN RAISE EXCEPTION 'This overlaps with another booking/rental! Choose another time!';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_overlap BEFORE INSERT ON archive
FOR EACH ROW EXECUTE FUNCTION check_overlap();