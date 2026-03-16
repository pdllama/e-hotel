CREATE TABLE IF NOT EXISTS address (
    address_id      UUID        PRIMARY KEY,
    street_number   INTEGER,
    apt_number      VARCHAR,
    postal_code     VARCHAR,
    city            VARCHAR,
    state           VARCHAR,
    country         VARCHAR
);