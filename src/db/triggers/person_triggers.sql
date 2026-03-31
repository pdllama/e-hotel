
/* 
    Only Customer accounts can create a booking, but we should allow people with
    employee accounts to create bookings without having to create a whole new account
    
    Rather than use application logic to create a matching customer entry when an
    employee-only person creates a booking, we can use a trigger to generate 
    a new customer entry.

    Note: We have to create the trigger on archives because bookings do not have information
    on the SSN of the customer
 */ 

CREATE OR REPLACE FUNCTION create_customer_if_not_exists()
RETURNS TRIGGER AS $$
BEGIN 
    IF (NEW.status = 'booked')
    THEN 
        IF NOT EXISTS (
            SELECT 1 FROM customer WHERE SSN = NEW.guest_id
        )
        THEN INSERT INTO customer(SSN) VALUES (NEW.guest_id);
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_customer BEFORE INSERT ON archive
FOR EACH ROW EXECUTE FUNCTION create_customer_if_not_exists();
