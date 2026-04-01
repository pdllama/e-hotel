CREATE TABLE IF NOT EXISTS hotel_chain (
    chain_name      VARCHAR     PRIMARY KEY,
    co_address      UUID,
    FOREIGN KEY (co_address) REFERENCES address(address_id)
);

CREATE TABLE IF NOT EXISTS hotel (
    address_id      UUID        PRIMARY KEY,
    chain_name      VARCHAR,
    manager_id      INTEGER     NOT NULL,
    FOREIGN KEY (address_id) REFERENCES address(address_id),
    FOREIGN KEY (chain_name) REFERENCES hotel_chain(chain_name) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(SSN) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS room (
    address_id              UUID,
    room_number             INTEGER,
    price                   INTEGER,
    capacity                INTEGER,
    view                    room_view,
    extension_possible      BOOLEAN,
    PRIMARY KEY (address_id, room_number),
    FOREIGN KEY (address_id) REFERENCES hotel(address_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS room_problem (
    problem_id      UUID    PRIMARY KEY,
    address_id      UUID,
    room_number     INTEGER,
    type            problem_type,
    description     TEXT,
    status          problem_status,
    log_date        TIMESTAMP,
    resolved_date   TIMESTAMP,
    FOREIGN KEY (address_id, room_number) REFERENCES room(address_id, room_number) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS amenity (
    amenity_name            VARCHAR     PRIMARY KEY,
    amenity_description     TEXT
);

CREATE TABLE IF NOT EXISTS room_has_amenity (
    address_id      UUID,
    room_number     INTEGER,
    amenity_name    VARCHAR,
    PRIMARY KEY (address_id, room_number, amenity_name),
    FOREIGN KEY (address_id, room_number) REFERENCES room(address_id, room_number) ON DELETE CASCADE ON UPDATE CASCADE
);

