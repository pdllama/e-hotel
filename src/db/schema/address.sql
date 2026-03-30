CREATE TABLE IF NOT EXISTS address (
    address_id      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    street_number   INTEGER,
    street_name     VARCHAR,
    apt_number      INTEGER DEFAULT 0,
    postal_code     VARCHAR,
    city            VARCHAR,
    state           VARCHAR,
    country         VARCHAR,
    UNIQUE(street_number, street_name, apt_number, postal_code, city, state, country)
);