CREATE TABLE IF NOT EXISTS hotel_email (
    address_id  UUID,
    e_mail      VARCHAR,
    PRIMARY KEY (address_id, e_mail),
    FOREIGN KEY (address_id) REFERENCES hotel(address_id)
);

CREATE TABLE IF NOT EXISTS hotel_phone_number (
    address_id      UUID,
    phone_number    VARCHAR,
    PRIMARY KEY (address_id, phone_number),
    FOREIGN KEY (address_id) REFERENCES hotel(address_id)
);

CREATE TABLE IF NOT EXISTS chain_email (
    chain_name  VARCHAR,
    e_mail      VARCHAR,
    PRIMARY KEY (chain_name, e_mail),
    FOREIGN KEY (chain_name) REFERENCES hotel_chain(chain_name)
);

CREATE TABLE IF NOT EXISTS chain_phone_number (
    chain_name      VARCHAR,
    phone_number    VARCHAR,
    PRIMARY KEY (chain_name, phone_number),
    FOREIGN KEY (chain_name) REFERENCES hotel_chain(chain_name)
);