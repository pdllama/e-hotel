CREATE TABLE IF NOT EXISTS archive (
    archive_id      UUID        PRIMARY KEY,
    guest_id        INTEGER     NULL,
    address_id      UUID        NULL,
    room_number     INTEGER     NULL,
    status          archive_status,
    stay_start_date DATE,
    stay_end_date   DATE,
    FOREIGN KEY (address_id, room_number) REFERENCES room(address_id, room_number) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (guest_id) REFERENCES customer(SSN) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS booking (
    archive_id      UUID        PRIMARY KEY,
    created_at      TIMESTAMP   DEFAULT CURRENT_TIMESTAMP   NOT NULL,
    paid_for        BOOLEAN     DEFAULT false,
    FOREIGN KEY (archive_id) REFERENCES archive(archive_id)
);

CREATE TABLE IF NOT EXISTS rental (
    archive_id      UUID        PRIMARY KEY,
    check_in_time   TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    check_out_time  TIMESTAMP,
    checked_in_by   INTEGER     NULL,
    checked_out_by  INTEGER     NULL,
    FOREIGN KEY (archive_id) REFERENCES archive(archive_id),
    FOREIGN KEY (checked_in_by) REFERENCES employee(SSN) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (checked_out_by) REFERENCES employee(SSN) ON DELETE SET NULL ON UPDATE CASCADE
);