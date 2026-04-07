
/* 
    You shouldn't be able to create a rental/booking at a given time if there is already a scheduled 
    booking that overlaps with those dates.

    This trigger stops archive inserts (bookings or direct rentals) that overlap with a previous one.

    It also checks that any archives inserted with a "booked" or "renting" status 
    has a stay_start_date today or after, never before, AND that the start date is before the end date.
 */ 

CREATE OR REPLACE FUNCTION check_overlap()
RETURNS TRIGGER AS $$
BEGIN 
    IF (NEW.status = 'booked' OR NEW.status = 'renting')
    THEN 
        IF NEW.stay_start_date < CURRENT_DATE
        THEN RAISE EXCEPTION 'You cannot book or rent out a room in the past!';
        END IF;

        IF NEW.stay_start_date > NEW.stay_end_date 
        THEN RAISE EXCEPTION 'Stay End Date cannot be before the Stay Start Date!';
        END IF;

        IF EXISTS (
            SELECT 1 FROM archive WHERE address_id = NEW.address_id AND room_number = NEW.room_number AND stay_start_date < NEW.stay_end_date AND stay_end_date > NEW.stay_start_date
        )
        THEN RAISE EXCEPTION 'This overlaps with another booking/rental! Choose another time!';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/* Note: the trigger that runs this function is added AFTER seeding the archives. See main.ts in seeding folder. */

/*
    I ran into problems trying to retain archives when a room is deleted solely with constraints, because room_number and address_id is a composite key.
    So I created custom triggers for room deletion and hotel deletion
*/

CREATE OR REPLACE FUNCTION nullify_on_room_deletion()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE archive SET address_id = NULL, room_number = NULL 
    WHERE address_id = OLD.address_id AND room_number = OLD.room_number;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER nullify_archive_room_deletion BEFORE DELETE ON room 
FOR EACH ROW EXECUTE FUNCTION nullify_on_room_deletion();



CREATE OR REPLACE FUNCTION nullify_on_hotel_deletion()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE archive SET address_id = NULL, room_number = NULL 
    WHERE address_id = OLD.address_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER nullify_archive_hotel_deletion BEFORE DELETE ON hotel
FOR EACH ROW EXECUTE FUNCTION nullify_on_hotel_deletion();